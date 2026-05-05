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
      src: img.getAttribute("src") || "",
      alt: img.getAttribute("alt") || "Ambiente Doctor Barber",
    };
  });

  if (!slides.length) return;

  var idx = 0;
  var lastFocus = null;

  function showSlide(i) {
    idx = (i + slides.length) % slides.length;
    var s = slides[idx];
    imgEl.src = s.src;
    imgEl.alt = s.alt;
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

  firstRow.querySelectorAll(".ambient-marquee__figure").forEach(function (fig) {
    var sx = 0;
    var sy = 0;

    fig.addEventListener(
      "pointerdown",
      function (e) {
        sx = e.clientX;
        sy = e.clientY;
      },
      true
    );

    fig.addEventListener("click", function (e) {
      if (marqueeRoot && marqueeRoot.getAttribute("data-marquee-moved") === "1") {
        return;
      }
      if (Math.abs(e.clientX - sx) > 14 || Math.abs(e.clientY - sy) > 14) {
        return;
      }
      e.preventDefault();
      var i = slideIndexFromFigure(fig);
      if (i >= 0) open(i);
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
