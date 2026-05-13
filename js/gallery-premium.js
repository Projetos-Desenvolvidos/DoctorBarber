/**
 * Galeria premium — spotlight + carrossel (auto + arrastar)
 */
(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ——— Spotlight: zoom/parallax com scrub + entrada do texto ——— */
  function initSpotlights() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }

    var panels = document.querySelectorAll("[data-spotlight]");
    if (!panels.length) return;

    panels.forEach(function (panel) {
      var bgImg = panel.querySelector(".spotlight__bg img");
      var inner = panel.querySelector(".spotlight__inner");
      var animEls = panel.querySelectorAll(".spotlight__anim");
      if (!bgImg || !inner) return;

      if (prefersReduced) {
        gsap.set(animEls, { opacity: 1, y: 0 });
        return;
      }

      gsap.to(bgImg, {
        scale: 1.06,
        yPercent: -5,
        ease: "none",
        scrollTrigger: {
          trigger: panel,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.15,
        },
      });

      gsap.from(animEls, {
        opacity: 0,
        y: 64,
        duration: 1.05,
        stagger: 0.12,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: panel,
          start: "top 78%",
          once: true,
        },
      });
    });
  }

  /* ——— Carrossel infinito: auto suave + arrastar (pointer) + inércia ——— */
  function initGalleryInfiniteDrag(marquee) {
    if (prefersReduced || !marquee) return;

    var track = marquee.querySelector(".gallery-cut-marquee__track");
    var viewport = marquee.querySelector(".gallery-cut-marquee__viewport");
    if (!track || !viewport) return;

    if (typeof gsap !== "undefined") {
      gsap.killTweensOf(track);
    }

    var loopW = 0;
    var x = 0;
    var phase = "idle";
    var downClientX = 0;
    var downClientY = 0;
    var lastClientX = 0;
    var velX = 0;
    var moveHist = [];
    var docPaused = false;
    var rafHandle = 0;
    var lastTick = 0;

    var AUTO_PX_PER_S = 38;
    var VEL_STOP = 5;
    var FRICTION_PER_S = 3.2;

    function primeImages() {
      var imgs = track.querySelectorAll("img");
      var tasks = [];
      for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].decode) {
          tasks.push(
            imgs[i].decode().catch(function () {
              return undefined;
            })
          );
        }
      }
      return tasks.length ? Promise.all(tasks) : Promise.resolve();
    }

    function readLoopW() {
      var rows = track.querySelectorAll(".gallery-cut-marquee__row");
      if (rows.length < 3) return 0;
      void track.offsetHeight;

      var w0 = rows[0].offsetWidth;
      var w1 = rows[1].offsetWidth;
      var w2 = rows[2].offsetWidth;
      var g1 = rows[1].offsetLeft - rows[0].offsetLeft;
      var g2 = rows[2].offsetLeft - rows[1].offsetLeft;

      if (w0 < 32 || w1 < 32 || w2 < 32) return 0;
      if (Math.abs(w0 - w1) > 14 || Math.abs(w1 - w2) > 14) return 0;
      if (Math.abs(g1 - g2) > 14) return 0;

      var m = Math.min(w0, w1, w2, g1, g2);
      if (m < 32) return 0;
      return m;
    }

    function wrap() {
      if (loopW <= 0) return;
      var s = -x;
      var guard = 0;
      while (s >= 2 * loopW && guard < 8) {
        x += loopW;
        s = -x;
        guard++;
      }
      guard = 0;
      while (s <= 0 && guard < 8) {
        x -= loopW;
        s = -x;
        guard++;
      }
    }

    function paintOnly() {
      track.style.transform = "translate3d(" + x + "px,0,0)";
    }

    function sync() {
      wrap();
      paintOnly();
    }

    function releaseVelocityPxPerS() {
      if (moveHist.length < 2) return 0;
      var n = moveHist.length;
      var a = moveHist[n - 1];
      var b = moveHist[n - 2];
      var dt = a.t - b.t;
      if (dt < 4) return 0;
      return ((a.x - b.x) / dt) * 1000;
    }

    function remeasure() {
      primeImages().then(function () {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            var nw = readLoopW();
            if (nw < 32) {
              setTimeout(remeasure, 72);
              return;
            }
            loopW = nw;
            x = -loopW;
            sync();
          });
        });
      });
    }

    function tick(t) {
      rafHandle = requestAnimationFrame(tick);
      if (docPaused || phase === "drag" || loopW < 32) {
        lastTick = t;
        return;
      }
      if (!lastTick) lastTick = t;
      var dt = Math.min(0.032, Math.max(0.001, (t - lastTick) / 1000));
      lastTick = t;

      if (Math.abs(velX) > VEL_STOP) {
        x += velX * dt;
        velX *= Math.exp(-FRICTION_PER_S * dt);
      } else {
        velX = 0;
        x -= AUTO_PX_PER_S * dt;
      }
      sync();
    }

    function onPointerDown(e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      phase = "undecided";
      downClientX = e.clientX;
      downClientY = e.clientY;
      lastClientX = e.clientX;
      moveHist = [{ x: e.clientX, t: performance.now() }];
      velX = 0;
    }

    function onPointerMove(e) {
      if (phase === "idle") return;

      if (phase === "undecided") {
        var rdx = e.clientX - downClientX;
        var rdy = e.clientY - downClientY;
        if (rdx * rdx + rdy * rdy < 81) return;
        if (Math.abs(rdx) > Math.abs(rdy) * 1.05) {
          phase = "drag";
          lastClientX = e.clientX;
          viewport.classList.add("gallery-cut-marquee__viewport--dragging");
          try {
            viewport.setPointerCapture(e.pointerId);
          } catch (err) {}
        } else {
          phase = "idle";
          return;
        }
      }

      if (phase !== "drag") return;

      if (e.cancelable) e.preventDefault();

      var dx = e.clientX - lastClientX;
      lastClientX = e.clientX;
      x += dx;
      var now = performance.now();
      moveHist.push({ x: e.clientX, t: now });
      if (moveHist.length > 6) moveHist.shift();
      sync();
    }

    function onPointerUp(e) {
      if (phase === "undecided") {
        phase = "idle";
        return;
      }
      if (phase !== "drag") return;
      phase = "idle";
      viewport.classList.remove("gallery-cut-marquee__viewport--dragging");
      try {
        if (viewport.hasPointerCapture(e.pointerId)) {
          viewport.releasePointerCapture(e.pointerId);
        }
      } catch (err2) {}
      velX = releaseVelocityPxPerS() * 1.08;
      moveHist = [];
      lastTick = 0;
      sync();
    }

    viewport.addEventListener("pointerdown", onPointerDown, { passive: true });
    viewport.addEventListener("pointermove", onPointerMove, { passive: false });
    viewport.addEventListener("pointerup", onPointerUp, { passive: true });
    viewport.addEventListener("pointercancel", onPointerUp, { passive: true });

    document.addEventListener(
      "visibilitychange",
      function () {
        docPaused = document.hidden;
        lastTick = 0;
      },
      { passive: true }
    );

    if (typeof ResizeObserver !== "undefined") {
      var ro = new ResizeObserver(function () {
        remeasure();
      });
      ro.observe(track);
    }

    window.addEventListener("resize", remeasure, { passive: true });
    window.addEventListener("orientationchange", function () {
      setTimeout(remeasure, 360);
    });

    track.querySelectorAll("img").forEach(function (img) {
      if (!img.complete) {
        img.addEventListener("load", remeasure, { passive: true });
      }
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(remeasure);
    }

    remeasure();
    setTimeout(remeasure, 80);
    setTimeout(remeasure, 420);
    rafHandle = requestAnimationFrame(tick);
  }

  /* ——— Carrossel infinito: medida do loop + entrada GSAP ——— */
  function initGalleryCutMarquee() {
    var marquee = document.querySelector("[data-gallery-cut-marquee]");
    if (!marquee) return;

    initGalleryInfiniteDrag(marquee);

    if (!prefersReduced && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.from(marquee, {
        y: 40,
        duration: 1,
        delay: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".netflix-gallery",
          start: "top 85%",
          once: true,
        },
      });
    }
  }

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  initSpotlights();
  initGalleryCutMarquee();
})();
