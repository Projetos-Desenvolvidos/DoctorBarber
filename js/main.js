(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");
  var yearEl = document.getElementById("year");
  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Header shadow on scroll */
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", open ? "false" : "true");
      siteNav.classList.toggle("is-open", !open);
      document.body.style.overflow = open ? "" : "hidden";
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });

    window.addEventListener(
      "resize",
      function () {
        if (window.matchMedia("(min-width: 769px)").matches && siteNav.classList.contains("is-open")) {
          navToggle.setAttribute("aria-expanded", "false");
          siteNav.classList.remove("is-open");
          document.body.style.overflow = "";
        }
      },
      { passive: true }
    );
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length && !prefersReduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var parent = el.closest(".servicos-premium__composition, .galeria-grid, .footer-premium");
          var delay = 0;
          if (parent) {
            var siblings = parent.querySelectorAll("[data-reveal]");
            var idx = Array.prototype.indexOf.call(siblings, el);
            delay = Math.min(idx * 60, 240);
          }
          setTimeout(function () {
            el.classList.add("is-visible");
          }, delay);
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Count-up stats */
  function animateCount(el, target, duration) {
    var start = 0;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var current = Math.floor(eased * target);
      el.textContent = formatNum(current);
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNum(target);
      }
    }

    function formatNum(n) {
      return n >= 1000 ? n.toLocaleString("pt-BR") : String(n);
    }

    requestAnimationFrame(step);
  }

  var statNums = document.querySelectorAll(".stat-num[data-count]");
  if (statNums.length && !prefersReduced && "IntersectionObserver" in window) {
    var statsIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-count"), 10);
          if (!isNaN(target)) {
            animateCount(el, target, 1600);
          }
          statsIo.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    statNums.forEach(function (el) {
      statsIo.observe(el);
    });
  } else {
    statNums.forEach(function (el) {
      var t = parseInt(el.getAttribute("data-count"), 10);
      if (!isNaN(t)) {
        el.textContent = t >= 1000 ? t.toLocaleString("pt-BR") : String(t);
      }
    });
  }

  /* App / store links — substitua pelos URLs reais */
  var APP_URL = "#app-download";
  var STORE_URL = "#app-download";

  document.querySelectorAll("[data-app-link]").forEach(function (a) {
    if (a.getAttribute("href") === "#") {
      a.setAttribute("href", APP_URL);
    }
  });
  document.querySelectorAll("[data-store-link]").forEach(function (a) {
    a.setAttribute("href", STORE_URL);
  });

  /* Hero — rotação suave da segunda linha do título */
  var phraseStack = document.querySelector(".hero-phrase-slot__stack");
  if (phraseStack) {
    var phraseEls = phraseStack.querySelectorAll(".hero-phrase-slot__phrase");
    var phraseIx = 0;
    var phraseTimer = null;

    function syncPhraseAria() {
      phraseEls.forEach(function (el, i) {
        var on = i === phraseIx;
        el.classList.toggle("is-active", on);
        el.setAttribute("aria-hidden", on ? "false" : "true");
      });
    }

    function nextPhrase() {
      phraseIx = (phraseIx + 1) % phraseEls.length;
      syncPhraseAria();
      schedulePhrase();
    }

    function schedulePhrase() {
      if (phraseTimer) clearTimeout(phraseTimer);
      var ms = 2000 + Math.floor(Math.random() * 1001);
      phraseTimer = window.setTimeout(nextPhrase, ms);
    }

    if (phraseEls.length > 1 && !prefersReduced) {
      syncPhraseAria();
      schedulePhrase();
    } else {
      syncPhraseAria();
    }
  }

  /* Hero parallax (subtle) */
  var heroBg = document.querySelector(".hero-bg img");
  if (heroBg && !prefersReduced) {
    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var y = window.scrollY;
          var max = window.innerHeight;
          var p = Math.min(y / max, 1);
          heroBg.style.transform = "translate3d(0, " + p * 28 + "px, 0) scale(" + (1 + p * 0.02) + ")";
          ticking = false;
        });
      },
      { passive: true }
    );
  }
})();
