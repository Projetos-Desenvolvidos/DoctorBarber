/**
 * Textos — entrada no hero/header + revelação no scroll (GSAP ScrollTrigger.batch)
 * Respeita [data-no-text-anim] nas seções que já têm animação própria.
 */
(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function skipRegion(el) {
    return el.closest("[data-no-text-anim]") || el.closest(".hero") || el.closest("[aria-hidden=\"true\"]");
  }

  function pushUnique(arr, el) {
    if (!el || arr.indexOf(el) !== -1) return;
    arr.push(el);
  }

  function collectScrollTargets() {
    var arr = [];
    var selectors =
      "main h1, main h2, main h3, main h4, main p, main figcaption, main .section-editorial__index, main .cta-block a.btn";

    document.querySelectorAll(selectors).forEach(function (el) {
      if (skipRegion(el)) return;
      pushUnique(arr, el);
    });

    document.querySelectorAll("footer .footer-col, footer .footer-premium__cta, footer .footer-copy").forEach(function (el) {
      if (el.closest("[aria-hidden=\"true\"]")) return;
      pushUnique(arr, el);
    });

    return arr;
  }

  /* — Header na entrada (hero usa animação própria no slider) — */
  gsap.set(".site-header .logo-img, .site-header .logo-text-nav__name, .site-header .logo-text-nav__sub", {
    autoAlpha: 0,
    y: -8,
  });
  gsap.to(".site-header .logo-img, .site-header .logo-text-nav__name, .site-header .logo-text-nav__sub", {
    autoAlpha: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.06,
    ease: "power2.out",
    delay: 0.02,
  });

  if (window.matchMedia("(min-width: 769px)").matches) {
    gsap.set(".site-header .site-nav a", { autoAlpha: 0, y: -8 });
    gsap.to(".site-header .site-nav a", {
      autoAlpha: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.04,
      ease: "power2.out",
      delay: 0.12,
    });
  } else {
    gsap.set(".nav-toggle", { autoAlpha: 0, scale: 0.92 });
    gsap.to(".nav-toggle", { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)", delay: 0.1 });
  }

  /* — Demais textos no scroll — */
  var scrollTargets = collectScrollTargets();
  if (scrollTargets.length) {
    gsap.set(scrollTargets, { autoAlpha: 0, y: 32 });

    ScrollTrigger.batch(scrollTargets, {
      interval: 0.1,
      batchMax: 10,
      onEnter: function (batch) {
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.68,
          stagger: 0.065,
          ease: "power3.out",
          overwrite: "auto",
        });
      },
      start: "top 86%",
      once: true,
    });
  }

  ScrollTrigger.refresh();
})();
