/**
 * Serviços — entrada GSAP + microinteração no título
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
  var cards = section.querySelectorAll("[data-servico-card]");

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
      tl.from(headerEls, { autoAlpha: 0, y: 32, duration: 0.75, stagger: 0.1 }, 0);
    }

    var narrow =
      typeof window.matchMedia !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
    var cardStagger = narrow ? 0.06 : 0.09;
    var cardDur = narrow ? 0.52 : 0.65;
    if (cards.length) {
      tl.from(
        cards,
        { autoAlpha: 0, y: narrow ? 28 : 36, duration: cardDur, stagger: cardStagger, ease: "power3.out" },
        0.18
      );
    }

  }

  if (prefersReduced) {
    return;
  }

  runIntro();
})();
