/**
 * Carrossel horizontal infinito — ambiente (CSS transform + rAF, sem libs).
 */
(function () {
  "use strict";

  var root = document.querySelector("[data-ambient-marquee]");
  if (!root) return;

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var viewport = root.querySelector(".ambient-marquee__viewport");
  var track = root.querySelector(".ambient-marquee__track");
  var rowA = root.querySelector(".ambient-marquee__row");

  if (!viewport || !track || !rowA) return;

  if (prefersReduced) {
    return;
  }

  var speedPxPerSec = 58;
  /* Faixa [-segment, 0): fluxo visual esquerda→direita com cópia à direita da primeira fila. */
  var pos = 0;
  var segment = 1;
  var gapBetweenRows = 0;
  var dragging = false;
  var hoverPause = false;
  var inView = true;
  var dragDistance = 0;
  var captureId = null;
  var lastPointerX = 0;
  var lastTs = 0;
  var rafId = 0;

  function readGap() {
    var cs = window.getComputedStyle(track);
    var g = cs.columnGap || cs.gap || "0";
    var n = parseFloat(g);
    return isNaN(n) ? 0 : n;
  }

  function measure() {
    gapBetweenRows = readGap();
    segment = rowA.offsetWidth + gapBetweenRows;
    if (segment < 1) segment = 1;
  }

  function wrapPos() {
    while (pos >= 0) pos -= segment;
    while (pos < -segment) pos += segment;
  }

  function syncTransform() {
    track.style.transform = "translate3d(" + pos + "px,0,0)";
  }

  function tick(ts) {
    if (!lastTs) lastTs = ts;
    var dt = Math.min((ts - lastTs) / 1000, 0.056);
    lastTs = ts;

    if (!dragging && !hoverPause && inView) {
      pos += speedPxPerSec * dt;
    }

    wrapPos();
    syncTransform();
    rafId = window.requestAnimationFrame(tick);
  }

  function onPointerDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true;
    dragDistance = 0;
    root.removeAttribute("data-marquee-moved");
    captureId = e.pointerId;
    lastPointerX = e.clientX;
    root.classList.add("is-dragging");
    viewport.setPointerCapture(captureId);
  }

  function onPointerMove(e) {
    if (!dragging || e.pointerId !== captureId) return;
    var dx = e.clientX - lastPointerX;
    lastPointerX = e.clientX;
    dragDistance += Math.abs(dx);
    if (dragDistance > 12) {
      root.setAttribute("data-marquee-moved", "1");
    }
    pos += dx;
    wrapPos();
    syncTransform();
  }

  function endDrag(e) {
    if (!dragging || e.pointerId !== captureId) return;
    dragging = false;
    root.classList.remove("is-dragging");
    try {
      viewport.releasePointerCapture(captureId);
    } catch (err) {
      /* ignore */
    }
    captureId = null;
    window.setTimeout(function () {
      root.removeAttribute("data-marquee-moved");
    }, 320);
  }

  root.addEventListener(
    "pointerenter",
    function () {
      hoverPause = true;
    },
    { passive: true }
  );

  root.addEventListener(
    "pointerleave",
    function () {
      hoverPause = false;
    },
    { passive: true }
  );

  viewport.addEventListener("pointerdown", onPointerDown, { passive: true });
  viewport.addEventListener("pointermove", onPointerMove, { passive: true });
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      measure();
      wrapPos();
      syncTransform();
    }, 120);
  });

  function boot() {
    measure();
    pos = -segment;
    wrapPos();
    syncTransform();
    lastTs = 0;
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = window.requestAnimationFrame(tick);
  }

  if (document.readyState === "complete") {
    boot();
  } else {
    window.addEventListener("load", boot);
  }

  window.requestAnimationFrame(function () {
    measure();
    pos = -segment;
    wrapPos();
    syncTransform();
  });

  var ambientWrap = document.querySelector(".brand-story__ambient-wrap");
  if (ambientWrap && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          inView = entry.isIntersecting;
        });
      },
      { root: null, rootMargin: "60px 0px", threshold: 0 }
    );
    io.observe(ambientWrap);
  }
})();
