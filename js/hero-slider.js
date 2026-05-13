(function () {
  "use strict";

  var root = document.querySelector("[data-hero-slider]");
  if (!root) return;

  var slides = root.querySelectorAll(".hero-slider__slide");
  var dots = root.querySelectorAll("[data-hero-dot]");
  var total = slides.length;
  if (total < 2) return;

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ix = 0;
  var timer = null;
  var INTERVAL_MS = 5000;
  var paused = false;

  function clearTimer() {
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
  }

  function schedule() {
    clearTimer();
    if (prefersReduced || paused) return;
    timer = window.setTimeout(function () {
      goTo((ix + 1) % total, false);
    }, INTERVAL_MS);
  }

  function syncDots() {
    dots.forEach(function (btn, i) {
      var on = i === ix;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
      btn.setAttribute("tabindex", on ? "0" : "-1");
    });
  }

  function syncSlides() {
    slides.forEach(function (slide, i) {
      var on = i === ix;
      slide.classList.toggle("is-active", on);
      slide.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) {
        slide.removeAttribute("inert");
      } else {
        slide.setAttribute("inert", "");
      }
    });
  }

  function goTo(nextIx, user) {
    if (nextIx === ix && user) return;
    ix = (nextIx + total) % total;
    syncSlides();
    syncDots();
    schedule();
  }

  dots.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var n = parseInt(btn.getAttribute("data-hero-dot"), 10);
      if (!isNaN(n)) goTo(n, true);
    });
  });

  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(ix + 1, true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(ix - 1, true);
    }
  });

  root.addEventListener("focusin", function () {
    paused = true;
    clearTimer();
  });

  root.addEventListener("focusout", function () {
    if (!root.contains(document.activeElement)) {
      paused = false;
      schedule();
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      clearTimer();
    } else if (!paused) {
      schedule();
    }
  });

  syncSlides();
  syncDots();
  if (!prefersReduced) schedule();
})();
