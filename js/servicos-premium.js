/**
 * Serviços luxury — revelação no scroll (IntersectionObserver, JS vanilla).
 */
(function () {
  "use strict";

  var root = document.querySelector(".servicos-luxury");
  if (!root || !("IntersectionObserver" in window)) return;

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var nodes = root.querySelectorAll("[data-luxury-reveal]");
  if (!nodes.length) return;

  if (prefersReduced) {
    nodes.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var staggerMs = 55;
  var rootMargin = "0px 0px -7% 0px";

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var group = el.closest(".servicos-luxury__grid");
        var delay = 0;
        if (group) {
          var siblings = group.querySelectorAll("[data-luxury-reveal]");
          var idx = Array.prototype.indexOf.call(siblings, el);
          if (idx >= 0) delay = Math.min(idx * staggerMs, 400);
        }
        window.setTimeout(function () {
          el.classList.add("is-visible");
        }, delay);
        io.unobserve(el);
      });
    },
    { rootMargin: rootMargin, threshold: 0.06 }
  );

  nodes.forEach(function (el) {
    io.observe(el);
  });
})();
