/**
 * Doctor Barber — seção app: GSAP + ScrollTrigger
 * Um único PNG (celular1) + rotação 3D contínua — evita corte entre duas fotos.
 * Substitua STORE_IOS_URL e STORE_ANDROID_URL pelos links reais das lojas.
 */
(function () {
  "use strict";

  var STORE_IOS_URL = "https://apps.apple.com/app/id000000000";
  var STORE_ANDROID_URL = "https://play.google.com/store/apps/details?id=com.example";

  document.querySelectorAll("a[data-app-ios]").forEach(function (a) {
    a.href = STORE_IOS_URL;
  });
  document.querySelectorAll("a[data-app-android]").forEach(function (a) {
    a.href = STORE_ANDROID_URL;
  });

  var section = document.querySelector(".app-showcase");
  if (!section || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var outer = section.querySelector(".app-showcase__phone-outer");
  var tilt = section.querySelector(".app-showcase__phone-tilt");
  var floatEl = section.querySelector(".app-showcase__phone-float");
  var glow = section.querySelector(".app-showcase__glow");
  var copy = section.querySelector(".app-showcase__copy");

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    if (outer) {
      gsap.set(outer, { scale: 1, opacity: 1, y: 0, filter: "none" });
    }
    if (tilt) {
      gsap.set(tilt, {
        transformPerspective: 1200,
        rotationY: 0,
        rotationX: 0,
        rotation: 0,
        scale: 1,
      });
    }
    if (glow) gsap.set(glow, { opacity: 0.5 });
    return;
  }

  if (floatEl) {
    gsap.to(floatEl, {
      y: 10,
      duration: 2.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }

  var mm = gsap.matchMedia();

  mm.add("(min-width: 769px)", function () {
    gsap.set(outer, {
      scale: 0.82,
      opacity: 0.52,
      y: 56,
      filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
    });

    gsap.set(tilt, {
      transformPerspective: 1280,
      rotationY: 24,
      rotationX: 11,
      rotation: -7,
      scale: 0.94,
      transformOrigin: "50% 65%",
    });

    gsap.set(glow, { opacity: 0.22 });
    if (copy) {
      gsap.set(copy, { opacity: 0.35, y: 40 });
    }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=155%",
        pin: true,
        scrub: 1.15,
        anticipatePin: 1,
      },
    });

    tl.to(
      tilt,
      {
        rotationY: 0,
        rotationX: 0,
        rotation: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
      },
      0
    );

    tl.to(
      outer,
      {
        scale: 1,
        opacity: 1,
        y: 0,
        filter:
          "drop-shadow(0 32px 64px rgba(0,0,0,0.28)) drop-shadow(0 0 40px rgba(255,255,255,0.35))",
        duration: 1,
        ease: "power3.out",
      },
      0
    );

    tl.to(
      glow,
      {
        opacity: 0.85,
        duration: 0.85,
        ease: "power2.out",
      },
      0
    );

    if (copy) {
      tl.to(
        copy,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        },
        0.05
      );
    }

    return function () {
      tl.kill();
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
  });

  /* Mobile: sem pin/scrub — animação automática ao entrar na tela (evita bugs de scroll) */
  mm.add("(max-width: 768px)", function () {
    var introTl = null;
    var played = false;
    var io = null;

    function setMobileStart() {
      if (outer) {
        gsap.set(outer, {
          scale: 0.84,
          opacity: 0.52,
          y: 44,
          filter: "drop-shadow(0 18px 36px rgba(0,0,0,0.16))",
        });
      }
      if (tilt) {
        gsap.set(tilt, {
          transformPerspective: 1200,
          rotationY: 20,
          rotationX: 10,
          rotation: -6,
          scale: 0.94,
          transformOrigin: "50% 65%",
        });
      }
      if (glow) gsap.set(glow, { opacity: 0.24 });
      if (copy) gsap.set(copy, { opacity: 0.38, y: 28 });
    }

    function playIntroOnce() {
      if (played) return;
      played = true;
      if (io) {
        io.disconnect();
        io = null;
      }

      introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (tilt) {
        introTl.to(
          tilt,
          {
            rotationY: 0,
            rotationX: 0,
            rotation: 0,
            scale: 1,
            duration: 1.35,
          },
          0
        );
      }

      if (outer) {
        introTl.to(
          outer,
          {
            scale: 1,
            opacity: 1,
            y: 0,
            filter:
              "drop-shadow(0 26px 52px rgba(0,0,0,0.24)) drop-shadow(0 0 32px rgba(255,255,255,0.28))",
            duration: 1.35,
          },
          0
        );
      }

      if (glow) {
        introTl.to(
          glow,
          {
            opacity: 0.8,
            duration: 1,
            ease: "power2.out",
          },
          0
        );
      }

      if (copy) {
        introTl.to(
          copy,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
          },
          0.12
        );
      }
    }

    setMobileStart();

    if (!("IntersectionObserver" in window)) {
      playIntroOnce();
      return function () {
        if (introTl) introTl.kill();
        gsap.killTweensOf([outer, tilt, glow, copy].filter(Boolean));
      };
    }

    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          playIntroOnce();
        });
      },
      { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0.22 }
    );

    io.observe(section);

    requestAnimationFrame(function () {
      if (played || !section) return;
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh * 0.88 && rect.bottom > 48) {
        playIntroOnce();
      }
    });

    return function () {
      if (io) io.disconnect();
      if (introTl) introTl.kill();
      gsap.killTweensOf([outer, tilt, glow, copy].filter(Boolean));
    };
  });
})();
