/**
 * Seção história da marca — GSAP storytelling + parallax suave
 */
(function () {
  "use strict";

  var section = document.querySelector(".brand-story");
  if (!section) return;

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var rail = section.querySelector(".brand-story__rail");
  var rule = section.querySelector(".brand-story__rule");
  var brandIndex = section.querySelector(".section-editorial__index");
  var eyebrow = section.querySelector(".section-editorial__eyebrow");
  var titleLines = section.querySelectorAll("[data-brand-title-line]");
  var mutedTitle = section.querySelector(".section-editorial__title em");
  var lede = section.querySelector(".section-editorial__lede");
  var bodyParas = section.querySelectorAll("[data-brand-para]");
  var pullquote = section.querySelector(".brand-story__pullquote");
  var visual = section.querySelector("[data-brand-visual]");
  var frame = section.querySelector("[data-brand-frame]");
  var img = section.querySelector("[data-brand-img]");

  function textBlocks() {
    return [brandIndex, eyebrow, lede, pullquote]
      .concat(Array.prototype.slice.call(titleLines))
      .concat(Array.prototype.slice.call(bodyParas))
      .filter(Boolean);
  }

  if (prefersReduced || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    if (rail) rail.style.transform = "scaleY(1)";
    if (rule) rule.style.transform = "scaleX(1)";
    textBlocks().forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    if (visual) {
      visual.style.opacity = "1";
      visual.style.transform = "none";
    }
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function clearAnimProps() {
    var nodes = textBlocks().concat([visual, rail, rule, img, frame]).filter(Boolean);
    gsap.set(nodes, { clearProps: "transform,opacity,visibility,scale" });
  }

  var mm = gsap.matchMedia();

  mm.add("(min-width: 981px)", function () {
    gsap.set(textBlocks(), { autoAlpha: 0, y: 28 });
    if (visual) gsap.set(visual, { autoAlpha: 0, scale: 0.9 });
    if (rail) gsap.set(rail, { scaleY: 0, transformOrigin: "50% 0" });
    if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "0 50%" });

    var stEnter = ScrollTrigger.create({
      trigger: section,
      start: "top 78%",
      once: true,
      onEnter: function () {
        var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (rail) tl.to(rail, { scaleY: 1, duration: 1.1 }, 0);
        if (rule) tl.to(rule, { scaleX: 1, duration: 0.85 }, 0.15);

        if (brandIndex) tl.to(brandIndex, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.02);
        if (eyebrow) tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.65 }, 0.1);

        if (titleLines.length) {
          tl.to(
            titleLines,
            { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.14 },
            0.14
          );
        }

        if (mutedTitle) {
          tl.to(
            mutedTitle,
            { color: "#c9a227", duration: 1.05, ease: "power2.inOut" },
            0.52
          );
        }

        if (lede) tl.to(lede, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.34);

        if (visual) {
          tl.to(
            visual,
            { autoAlpha: 1, scale: 1, duration: 1.05, ease: "power2.out" },
            0.22
          );
        }

        if (bodyParas.length) {
          tl.to(
            bodyParas,
            { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.12 },
            0.48
          );
        }

        if (pullquote) tl.to(pullquote, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.66);

        tl.call(function () {
          if (!frame) return;
          gsap.to(frame, {
            y: -10,
            duration: 3.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });
      },
    });

    var stParallax = null;
    if (img) {
      stParallax = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.45,
        onUpdate: function (self) {
          var p = self.progress;
          gsap.set(img, { y: (p - 0.5) * 48 });
        },
      });
    }

    return function () {
      stEnter.kill();
      if (stParallax) stParallax.kill();
      gsap.killTweensOf(frame);
      clearAnimProps();
    };
  });

  mm.add("(max-width: 980px)", function () {
    gsap.set(textBlocks(), { autoAlpha: 0, y: 20 });
    if (visual) gsap.set(visual, { autoAlpha: 0, scale: 0.94 });
    if (rail) gsap.set(rail, { scaleY: 0, transformOrigin: "50% 0" });
    if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "0 50%" });

    var stEnterM = ScrollTrigger.create({
      trigger: section,
      start: "top 82%",
      once: true,
      onEnter: function () {
        var tlM = gsap.timeline({ defaults: { ease: "power2.out" } });
        if (rail) tlM.to(rail, { scaleY: 1, duration: 0.75 }, 0);
        if (rule) tlM.to(rule, { scaleX: 1, duration: 0.55 }, 0.08);
        if (brandIndex) tlM.to(brandIndex, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.06);
        if (eyebrow) tlM.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.12);
        if (titleLines.length) {
          tlM.to(titleLines, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.18);
        }
        if (mutedTitle) {
          tlM.to(
            mutedTitle,
            { color: "#c9a227", duration: 0.75, ease: "power2.inOut" },
            0.3
          );
        }
        if (lede) tlM.to(lede, { autoAlpha: 1, y: 0, duration: 0.48 }, 0.26);
        if (visual) tlM.to(visual, { autoAlpha: 1, scale: 1, duration: 0.65 }, 0.36);
        if (bodyParas.length) {
          tlM.to(bodyParas, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08 }, 0.44);
        }
        if (pullquote) tlM.to(pullquote, { autoAlpha: 1, y: 0, duration: 0.48 }, 0.54);
      },
    });

    return function () {
      stEnterM.kill();
      clearAnimProps();
    };
  });
})();
