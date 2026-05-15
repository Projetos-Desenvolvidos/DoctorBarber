/**
 * Lightbox das fotos do ambiente — abrir ao clicar, setas e teclado.
 */
(function () {
  "use strict";

  var root = document.getElementById("ambient-lightbox");
  if (!root) return;

  var backdrop = root.querySelector(".ambient-lightbox__backdrop");
  var btnClose = root.querySelector(".ambient-lightbox__close");
  var btnPrev = root.querySelector(".ambient-lightbox__nav--prev");
  var btnNext = root.querySelector(".ambient-lightbox__nav--next");
  var imgEl = root.querySelector(".ambient-lightbox__figure img");

  if (!backdrop || !btnClose || !btnPrev || !btnNext || !imgEl) return;

  var marqueeRoot = document.querySelector("[data-ambient-marquee]");
  var firstRow = document.querySelector(".ambient-marquee__track > .ambient-marquee__row:first-child");

  if (!firstRow) return;

  var slides = Array.prototype.map.call(firstRow.querySelectorAll(".ambient-marquee__figure img"), function (img) {
    return {
      src: img.getAttribute("data-lightbox-src") || img.getAttribute("src") || "",
      alt: img.getAttribute("alt") || "Ambiente Doctor Barber",
    };
  });

  if (!slides.length) return;

  var idx = 0;
  var lastFocus = null;
  var tapThreshold = 14;

  function showSlide(i) {
    idx = (i + slides.length) % slides.length;
    var s = slides[idx];
    imgEl.src = s.src;
    imgEl.alt = s.alt;
    root.setAttribute("aria-label", "Foto " + (idx + 1) + " de " + slides.length + " — ambiente Doctor Barber");
  }

  function open(atIndex) {
    lastFocus = document.activeElement;
    root.removeAttribute("hidden");
    root.classList.add("is-open");
    document.body.style.overflow = "hidden";
    showSlide(atIndex);
    btnClose.focus();
  }

  function close() {
    root.classList.remove("is-open");
    root.setAttribute("hidden", "");
    document.body.style.overflow = "";
    imgEl.removeAttribute("src");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function slideIndexFromFigure(fig) {
    var slidesEls = firstRow.querySelectorAll(".ambient-marquee__figure");
    return Array.prototype.indexOf.call(slidesEls, fig);
  }

  function wasMarqueeDragged() {
    return marqueeRoot && marqueeRoot.getAttribute("data-marquee-moved") === "1";
  }

  function isTap(startX, startY, endX, endY) {
    return Math.abs(endX - startX) <= tapThreshold && Math.abs(endY - startY) <= tapThreshold;
  }

  function tryOpenFromFigure(fig, startX, startY, endX, endY) {
    if (wasMarqueeDragged()) return;
    if (!isTap(startX, startY, endX, endY)) return;
    var i = slideIndexFromFigure(fig);
    if (i >= 0) open(i);
  }

  firstRow.querySelectorAll(".ambient-marquee__figure").forEach(function (fig, slideIndex) {
    var sx = 0;
    var sy = 0;
    var label = "Ampliar foto " + (slideIndex + 1) + " do ambiente";

    fig.setAttribute("role", "button");
    fig.setAttribute("tabindex", "0");
    fig.setAttribute("aria-label", label);
    fig.setAttribute("title", "Clique para ampliar");

    fig.addEventListener(
      "pointerdown",
      function (e) {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        sx = e.clientX;
        sy = e.clientY;
      },
      true
    );

    fig.addEventListener("pointerup", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      tryOpenFromFigure(fig, sx, sy, e.clientX, e.clientY);
    });

    fig.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      open(slideIndexFromFigure(fig));
    });
  });

  btnPrev.addEventListener("click", function () {
    showSlide(idx - 1);
  });

  btnNext.addEventListener("click", function () {
    showSlide(idx + 1);
  });

  btnClose.addEventListener("click", close);

  backdrop.addEventListener("click", close);

  document.addEventListener("keydown", function (e) {
    if (!root.classList.contains("is-open")) return;
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      showSlide(idx - 1);
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      showSlide(idx + 1);
    }
  });
})();
