/**
 * Galeria premium — GSAP spotlight + carrossel horizontal
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

  /* ——— Carrossel Netflix ——— */
  function initNetflixCarousel() {
    var wrap = document.querySelector(".netflix-gallery__track-wrap");
    var slides = document.querySelectorAll(".netflix-gallery__slide");
    var btnPrev = document.querySelector(".netflix-gallery__nav--prev");
    var btnNext = document.querySelector(".netflix-gallery__nav--next");
    var dotsWrap = document.querySelector(".netflix-gallery__dots");

    if (!wrap || !slides.length) return;

    var dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      for (var d = 0; d < slides.length; d++) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "netflix-gallery__dot" + (d === 0 ? " is-active" : "");
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", "Slide " + (d + 1));
        dot.setAttribute("aria-selected", d === 0 ? "true" : "false");
        dotsWrap.appendChild(dot);
      }
      dots = Array.prototype.slice.call(dotsWrap.querySelectorAll(".netflix-gallery__dot"));
    }

    var track = wrap.querySelector(".netflix-gallery__track");

    function getTrackGap() {
      if (!track) return 16;
      var raw = window.getComputedStyle(track).gap || window.getComputedStyle(track).columnGap || "16px";
      var n = parseFloat(String(raw).split(/\s+/)[0], 10);
      return isNaN(n) ? 16 : n;
    }

    /** Posição scroll (left) para alinhar o slide `index` ao início da área visível */
    function getSlideScrollLeft(index) {
      if (index <= 0) return 0;
      var gap = getTrackGap();
      var total = 0;
      for (var j = 0; j < index; j++) {
        total += slides[j].offsetWidth;
        if (j < index - 1) {
          total += gap;
        }
      }
      return total;
    }

    function scrollToIndex(i, smooth) {
      var clamped = Math.max(0, Math.min(slides.length - 1, i));
      var target = getSlideScrollLeft(clamped);
      var maxScroll = Math.max(0, wrap.scrollWidth - wrap.clientWidth);
      wrap.scrollTo({
        left: Math.min(target, maxScroll),
        behavior: smooth === false ? "auto" : "smooth",
      });
    }

    function getActiveIndex() {
      var x = wrap.scrollLeft;
      var best = 0;
      var bestDist = Infinity;
      for (var i = 0; i < slides.length; i++) {
        var d = Math.abs(getSlideScrollLeft(i) - x);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      return best;
    }

    function updateDots() {
      var idx = getActiveIndex();
      dots.forEach(function (d, j) {
        d.classList.toggle("is-active", j === idx);
        d.setAttribute("aria-selected", j === idx ? "true" : "false");
      });
      var maxScroll = Math.max(0, wrap.scrollWidth - wrap.clientWidth);
      if (btnPrev) btnPrev.disabled = wrap.scrollLeft <= 8;
      if (btnNext) {
        btnNext.disabled = maxScroll > 0 ? wrap.scrollLeft >= maxScroll - 8 : true;
      }
    }

    var scrollTick;
    wrap.addEventListener(
      "scroll",
      function () {
        if (scrollTick) cancelAnimationFrame(scrollTick);
        scrollTick = requestAnimationFrame(updateDots);
      },
      { passive: true }
    );

    function go(delta) {
      var idx = getActiveIndex();
      scrollToIndex(idx + delta);
    }

    if (btnPrev) {
      btnPrev.addEventListener("click", function () {
        go(-1);
      });
    }
    if (btnNext) {
      btnNext.addEventListener("click", function () {
        go(1);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        scrollToIndex(i);
      });
    });

    window.addEventListener("resize", function () {
      updateDots();
    });

    updateDots();

    /* Entrada suave da área do carrossel (cabeçalho animado em text-reveal-global.js) */
    if (!prefersReduced && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      var shell = document.querySelector(".netflix-gallery__shell");
      if (shell) {
        gsap.from(shell, {
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
  }

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  initSpotlights();
  initNetflixCarousel();
})();
