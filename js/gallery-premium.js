/**
 * Galeria premium — GSAP spotlight + carrossel infinito (marquee)
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

  /* ——— Carrossel infinito: GSAP (Safari/iPhone falha com var() em @keyframes + mask). ——— */
  function initGalleryCutMarqueeMeasure(marquee) {
    if (prefersReduced || !marquee || typeof gsap === "undefined") return;

    var track = marquee.querySelector(".gallery-cut-marquee__track");
    var row = marquee.querySelector(".gallery-cut-marquee__row");
    var viewport = marquee.querySelector(".gallery-cut-marquee__viewport");
    if (!track || !row) return;

    var state = { tween: null };
    var rafId;

    function applyShift() {
      var w = row.getBoundingClientRect().width;
      if (w < 32) return;

      gsap.killTweensOf(track);
      gsap.set(track, { x: 0, force3D: true });

      state.tween = gsap.to(track, {
        x: -w,
        duration: 26,
        ease: "none",
        repeat: -1,
        overwrite: "auto",
        force3D: true,
      });
    }

    function schedule() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(applyShift);
    }

    var host = viewport || marquee;
    if (!host.dataset.marqueePauseWired) {
      host.dataset.marqueePauseWired = "1";
      host.addEventListener(
        "pointerenter",
        function () {
          if (state.tween) state.tween.pause();
        },
        { passive: true }
      );
      host.addEventListener(
        "pointerleave",
        function () {
          if (state.tween) state.tween.resume();
        },
        { passive: true }
      );
    }

    if (!marquee.dataset.marqueeVisWired) {
      marquee.dataset.marqueeVisWired = "1";
      document.addEventListener(
        "visibilitychange",
        function () {
          if (document.hidden) {
            if (state.tween) state.tween.pause();
          } else {
            if (state.tween) state.tween.resume();
          }
        },
        { passive: true }
      );
    }

    if (typeof ResizeObserver !== "undefined") {
      var ro = new ResizeObserver(function () {
        schedule();
      });
      ro.observe(row);
    }

    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("orientationchange", function () {
      setTimeout(schedule, 320);
    });

    marquee.querySelectorAll("img").forEach(function (img) {
      if (!img.complete) {
        img.addEventListener("load", schedule, { passive: true });
      }
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(schedule);
    }

    schedule();
    setTimeout(schedule, 60);
    setTimeout(schedule, 400);
  }

  /* ——— Carrossel infinito: medida do loop + entrada GSAP ——— */
  function initGalleryCutMarquee() {
    var marquee = document.querySelector("[data-gallery-cut-marquee]");
    if (!marquee) return;

    initGalleryCutMarqueeMeasure(marquee);

    if (!prefersReduced && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.from(marquee, {
        opacity: 0,
        y: 36,
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
