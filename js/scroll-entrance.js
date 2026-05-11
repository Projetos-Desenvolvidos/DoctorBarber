/**
 * Entradas no scroll — blocos principais (translateY suave, sem brigar com GSAP interno dos cards/spotlights).
 */
(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var ease = "power3.out";
  var dur = 0.82;

  function stOnce(trigger, start) {
    return {
      trigger: trigger,
      start: start || "top 88%",
      once: true,
    };
  }

  document.querySelectorAll("main > section:not(.hero)").forEach(function (section) {
    if (section.classList.contains("gallery-premium")) {
      var intro = section.querySelector(".gallery-premium__intro");
      if (intro) {
        gsap.from(intro, {
          y: 40,
          duration: 0.72,
          ease: ease,
          scrollTrigger: stOnce(intro, "top 88%"),
        });
      }
      return;
    }

    var inner =
      section.querySelector(".brand-story__inner") ||
      section.querySelector(".servicos-premium__inner") ||
      section.querySelector(".app-showcase__inner") ||
      section.querySelector(".testimonials-premium__inner") ||
      section.querySelector(".cta-inner");

    if (!inner) return;

    gsap.from(inner, {
      y: 48,
      duration: dur,
      ease: ease,
      scrollTrigger: stOnce(section, "top 87%"),
    });
  });

  var footerInner = document.querySelector(".site-footer--premium .footer-premium");
  if (footerInner) {
    gsap.from(footerInner, {
      y: 40,
      duration: 0.78,
      ease: ease,
      scrollTrigger: stOnce(footerInner.closest("footer") || footerInner, "top 91%"),
    });
  }

  ScrollTrigger.refresh();
})();
