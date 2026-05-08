/**
 * Serviços — reveal editorial em camadas (GSAP + ScrollTrigger)
 */
(function () {
  "use strict";

  var section = document.querySelector(".servicos-premium");
  if (!section) return;

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var indexEl = section.querySelector(".section-editorial__index");
  var eyebrow = section.querySelector(".section-editorial__eyebrow");
  var lede = section.querySelector(".section-editorial__lede");

  function runIntro() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var headerEls = [indexEl, eyebrow, section.querySelector(".section-editorial__title"), lede].filter(Boolean);
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 82%",
        once: true,
      },
      defaults: { ease: "power3.out" },
    });

    if (headerEls.length) {
      tl.from(headerEls, { autoAlpha: 0, y: 32, duration: 0.72, stagger: 0.09 }, 0);
    }

    var narrow =
      typeof window.matchMedia !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
    var showcase = section.querySelector(".servico-showcase");
    var panels = section.querySelectorAll(".servico-panel[data-servico-card]");
    var yPanel = narrow ? 24 : 32;

    if (showcase) {
      var innerBits = showcase.querySelectorAll(".servico-showcase__inner > *");
      tl.fromTo(
        showcase,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.42, ease: "power2.out" },
        0.12
      );
      if (innerBits.length) {
        tl.from(
          innerBits,
          {
            autoAlpha: 0,
            y: narrow ? 18 : 22,
            duration: narrow ? 0.52 : 0.62,
            stagger: narrow ? 0.055 : 0.07,
            ease: "power3.out",
          },
          0.17
        );
      }
    }

    if (panels.length) {
      tl.from(
        panels,
        {
          autoAlpha: 0,
          y: yPanel,
          duration: narrow ? 0.52 : 0.62,
          stagger: narrow ? 0.09 : 0.1,
        },
        narrow ? 0.34 : 0.38
      );
    }
  }

  if (prefersReduced) {
    return;
  }

  runIntro();
})();
