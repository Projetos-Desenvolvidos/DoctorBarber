/**
 * Galeria premium — spotlight + carrossel de cortes (entrada GSAP; scroll em cuts-marquee.js)
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

  /* ——— Carrossel cortes: entrada GSAP (movimento em js/cuts-marquee.js) ——— */
  function initGalleryCutMarquee() {
    var marquee = document.querySelector("[data-cuts-marquee]");
    if (!marquee) return;

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
