/**
 * Serviços Premium — reveal em camadas (GSAP + ScrollTrigger)
 */
(function () {
  "use strict";

  var section = document.querySelector(".servicos-premium");
  if (!section) return;

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var head = section.querySelector(".servicos-premium__head");
  var indexEl = head && head.querySelector(".section-editorial__index");
  var eyebrow = head && head.querySelector(".section-editorial__eyebrow");
  var titleEl = head && head.querySelector(".section-editorial__title");
  var lede = head && head.querySelector(".section-editorial__lede");

  function runIntro() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var headerEls = [indexEl, eyebrow, titleEl, lede].filter(Boolean);
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 82%",
        once: true,
      },
      defaults: { ease: "power3.out" },
    });

    if (headerEls.length) {
      tl.from(headerEls, { autoAlpha: 0, y: 28, duration: 0.68, stagger: 0.08 }, 0);
    }

    var narrow =
      typeof window.matchMedia !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
    var cards = section.querySelectorAll(".servicos-premium__hero-grid [data-servico-card]");
    var moreBlocks = section.querySelectorAll("[data-servico-more]");
    var ctaBlock = section.querySelector("[data-servico-cta]");
    var yCard = narrow ? 22 : 28;

    if (cards.length) {
      tl.from(
        cards,
        {
          autoAlpha: 0,
          y: yCard,
          duration: narrow ? 0.55 : 0.62,
          stagger: narrow ? 0.07 : 0.08,
        },
        0.14
      );
    }

    if (moreBlocks.length) {
      tl.from(
        moreBlocks,
        {
          autoAlpha: 0,
          y: narrow ? 20 : 24,
          duration: narrow ? 0.5 : 0.55,
          stagger: narrow ? 0.06 : 0.07,
        },
        narrow ? 0.42 : 0.48
      );
    }

    if (ctaBlock) {
      tl.from(
        ctaBlock,
        { autoAlpha: 0, y: narrow ? 20 : 26, duration: 0.58, ease: "power2.out" },
        narrow ? 0.58 : 0.64
      );
    }
  }

  if (prefersReduced) {
    return;
  }

  runIntro();
})();
