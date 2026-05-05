/**
 * Depoimentos premium — entrada GSAP + carrossel horizontal
 */
(function () {
  "use strict";

  var section = document.querySelector(".testimonials-premium");
  if (!section) return;

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var trackWrap = section.querySelector(".testimonials-premium__track-wrap");
  var track = section.querySelector(".testimonials-premium__track");
  var slides = Array.prototype.slice.call(section.querySelectorAll(".testimonials-premium__slide"));
  var btnPrev = section.querySelector(".testimonials-premium__nav--prev");
  var btnNext = section.querySelector(".testimonials-premium__nav--next");
  var dotsWrap = section.querySelector(".testimonials-premium__dots");

  function initIntro() {
    if (prefersReduced || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var introEls = Array.prototype.slice.call(section.querySelectorAll("[data-testimonial-intro]"));
    var cards = Array.prototype.slice.call(section.querySelectorAll("[data-testimonial-card]"));
    var cta = section.querySelector("[data-testimonial-cta]");
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

    if (introEls.length) {
      tl.from(
        introEls,
        { autoAlpha: 0, y: narrow ? 22 : 30, duration: narrow ? 0.58 : 0.7, stagger: 0.09 },
        0
      );
    }

    if (cards.length) {
      tl.from(
        cards,
        { autoAlpha: 0, y: narrow ? 24 : 32, duration: narrow ? 0.56 : 0.66, stagger: narrow ? 0.08 : 0.11 },
        0.18
      );
    }

    if (cta) {
      tl.from(cta, { autoAlpha: 0, y: 20, duration: 0.58 }, 0.46);
    }
  }

  function getGap() {
    if (!track) return 16;
    var raw = window.getComputedStyle(track).gap || window.getComputedStyle(track).columnGap || "16px";
    var n = parseFloat(String(raw).split(/\s+/)[0], 10);
    return isNaN(n) ? 16 : n;
  }

  function getSlideLeft(index) {
    if (!slides.length || index <= 0) return 0;
    var total = 0;
    var gap = getGap();
    for (var i = 0; i < index; i++) {
      total += slides[i].offsetWidth;
      if (i < index - 1) total += gap;
    }
    return total;
  }

  function getActiveIndex() {
    if (!trackWrap || !slides.length) return 0;
    var x = trackWrap.scrollLeft;
    var best = 0;
    var bestDist = Infinity;
    for (var i = 0; i < slides.length; i++) {
      var dist = Math.abs(getSlideLeft(i) - x);
      if (dist < bestDist) {
        best = i;
        bestDist = dist;
      }
    }
    return best;
  }

  function scrollToIndex(index, smooth) {
    if (!trackWrap || !slides.length) return;
    var clamped = Math.max(0, Math.min(slides.length - 1, index));
    var target = getSlideLeft(clamped);
    var maxScroll = Math.max(0, trackWrap.scrollWidth - trackWrap.clientWidth);
    trackWrap.scrollTo({
      left: Math.min(target, maxScroll),
      behavior: smooth === false ? "auto" : "smooth",
    });
  }

  function updateUI(dots) {
    if (!trackWrap || !slides.length) return;
    var idx = getActiveIndex();
    var maxScroll = Math.max(0, trackWrap.scrollWidth - trackWrap.clientWidth);

    if (btnPrev) btnPrev.disabled = trackWrap.scrollLeft <= 8;
    if (btnNext) btnNext.disabled = maxScroll > 0 ? trackWrap.scrollLeft >= maxScroll - 8 : true;

    if (dots && dots.length) {
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === idx);
        dot.setAttribute("aria-selected", i === idx ? "true" : "false");
      });
    }
  }

  function initCarousel() {
    if (!trackWrap || !slides.length) return;

    var dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "testimonials-premium__dot" + (i === 0 ? " is-active" : "");
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", "Depoimento " + (i + 1));
        dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
        dot.addEventListener("click", function () {
          scrollToIndex(i);
        });
        dotsWrap.appendChild(dot);
      });
      dots = Array.prototype.slice.call(dotsWrap.querySelectorAll(".testimonials-premium__dot"));
    }

    if (btnPrev) {
      btnPrev.addEventListener("click", function () {
        scrollToIndex(getActiveIndex() - 1);
      });
    }

    if (btnNext) {
      btnNext.addEventListener("click", function () {
        scrollToIndex(getActiveIndex() + 1);
      });
    }

    var rafId = 0;
    trackWrap.addEventListener(
      "scroll",
      function () {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function () {
          updateUI(dots);
        });
      },
      { passive: true }
    );

    window.addEventListener("resize", function () {
      updateUI(dots);
    });

    updateUI(dots);
  }

  initIntro();
  initCarousel();
})();
