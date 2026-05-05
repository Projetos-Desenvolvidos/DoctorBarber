/**
 * Equipe editorial — entrada GSAP padronizada com as demais seções
 */
(function () {
  "use strict";

  var section = document.querySelector(".team-editorial");
  if (!section) return;

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    return;
  }

  function runIntro() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var headerBits = Array.prototype.slice.call(section.querySelectorAll("[data-team-intro]"));
    var cards = Array.prototype.slice.call(section.querySelectorAll("[data-team-card]"));
    var narrow =
      typeof window.matchMedia !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 82%",
        once: true,
      },
      defaults: { ease: "power3.out" },
    });

    if (headerBits.length) {
      tl.from(
        headerBits,
        { autoAlpha: 0, y: narrow ? 24 : 34, duration: narrow ? 0.62 : 0.75, stagger: 0.1 },
        0
      );
    }

    if (cards.length) {
      tl.from(
        cards,
        { autoAlpha: 0, y: narrow ? 26 : 36, duration: narrow ? 0.56 : 0.68, stagger: narrow ? 0.07 : 0.1 },
        0.18
      );
    }
  }

  runIntro();
})();
