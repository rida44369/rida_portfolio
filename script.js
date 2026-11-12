
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Hero text animation
  const heroElements = [
    ".intro-label",
    ".hero h1",
    ".hero h2",
    ".hero-description",
    ".hero-buttons",
    ".hero-meta"
  ];

  if (!reduceMotion) {
    heroElements.forEach((selector, index) => {
      const element = document.querySelector(selector);
      if (!element) return;

      element.animate(
        [
          { opacity: 0, transform: "translateY(25px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        {
          duration: 850,
          delay: 150 + index * 130,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "both"
        }
      );
    });
  }

  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

  const mix = (a, b, t) => a + (b - a) * t;

  const smooth = value => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };

  const phase = (p, start, end) =>
    smooth((p - start) / (end - start));

  const desktopSection = document.querySelector("#desktop");
  const mobileSection = document.querySelector("#mobile");
  const laptop = document.querySelector("#laptop");
  const iphone = document.querySelector("#iphone");

  const desktopHeading = document.querySelector(
    ".desktop-showcase .showcase-heading"
  );
  const mobileHeading = document.querySelector(
    ".mobile-showcase .showcase-heading"
  );

  const desktopProgress = document.querySelector("#desktopProgress");
  const mobileProgress = document.querySelector("#mobileProgress");
  const desktopCaption = document.querySelector("#desktopCaption");
  const mobileCaption = document.querySelector("#mobileCaption");

  // Measure progress across each sticky scroll scene.
  function getProgress(section) {
    if (!section) return 0;
    const rect = section.getBoundingClientRect();
    const distance = Math.max(
      1,
      section.offsetHeight - window.innerHeight
    );
    return clamp(-rect.top / distance);
  }

  function laptopScale() {
    if (!laptop) return 1;

    return Math.min(
      window.innerWidth * 0.69 / laptop.offsetWidth,
      window.innerHeight * 0.53 / laptop.offsetHeight,
      0.82
    );
  }

  function phonePortraitScale() {
    if (!iphone) return 1;

    return Math.min(
      window.innerWidth * 0.66 / iphone.offsetWidth,
      window.innerHeight * 0.65 / iphone.offsetHeight,
      1
    );
  }

  function phoneLandscapeScale() {
    if (!iphone) return 1;

    return Math.min(
      window.innerWidth * 0.78 / iphone.offsetHeight,
      window.innerHeight * 0.52 / iphone.offsetWidth,
      1.05
    );
  }

  // DESKTOP: enter -> grow -> hold -> shrink -> exit
  function updateDesktop(p) {
    if (!laptop) return;

    const enter = phase(p, 0, 0.17);
    const grow = phase(p, 0.17, 0.44);
    const shrink = phase(p, 0.70, 0.91);
    const exit = phase(p, 0.92, 1);

    const zoom = grow * (1 - shrink);
    const base = laptopScale();

    // Extra zoom, capped to available viewport.
    const maxScale = Math.min(
      base * 1.45,
      window.innerWidth * 0.92 / laptop.offsetWidth,
      window.innerHeight * 0.76 / laptop.offsetHeight
    );

    const scale =
      mix(base * 0.82, base, enter) *
      mix(1, maxScale / base, zoom);

    const y = mix(85, 0, enter) - exit * 80;
    const opacity = enter * (1 - exit);

    laptop.style.setProperty("--laptop-scale", scale.toFixed(4));
    laptop.style.setProperty("--laptop-y", `${y.toFixed(2)}px`);
    laptop.style.setProperty("--laptop-opacity", opacity.toFixed(3));

    if (desktopHeading) {
      desktopHeading.style.opacity = String(
        1 - phase(p, 0.25, 0.45)
      );
    }

    if (desktopProgress) {
      desktopProgress.style.width = `${(p * 100).toFixed(1)}%`;
    }

    if (desktopCaption) {
      desktopCaption.textContent =
        p < 0.25
          ? "SCROLL TO EXPLORE"
          : p < 0.73
            ? "COMPLETE CV · CLOSER VIEW"
            : "DESIGNED WITH PURPOSE";
    }
  }

  // MOBILE: enter -> zoom -> rotate right -> return -> exit
  function updateMobile(p) {
    if (!iphone) return;

    const enter = phase(p, 0, 0.17);
    const grow = phase(p, 0.18, 0.40);
    const rotate = phase(p, 0.42, 0.66);
    const rotateBack = phase(p, 0.74, 0.90);
    const exit = phase(p, 0.92, 1);

    const turn = rotate * (1 - rotateBack);
    const angle = 90 * turn; // positive = clockwise/right

    const portrait = phonePortraitScale();
    const landscape = phoneLandscapeScale();

    const portraitZoom = Math.min(
      portrait * 1.25,
      window.innerWidth * 0.82 / iphone.offsetWidth,
      window.innerHeight * 0.79 / iphone.offsetHeight
    );

    const targetScale = mix(portraitZoom, landscape, turn);

    let scale = mix(portrait * 0.75, portrait, enter);
    scale = mix(scale, targetScale, grow);
    scale *= mix(1, 0.82, exit);

    const y = mix(100, 0, enter) - exit * 90;
    const opacity = enter * (1 - exit);

    iphone.style.setProperty("--phone-scale", scale.toFixed(4));
    iphone.style.setProperty("--phone-rotate", `${angle.toFixed(2)}deg`);
    iphone.style.setProperty("--phone-y", `${y.toFixed(2)}px`);
    iphone.style.setProperty("--phone-opacity", opacity.toFixed(3));

    // Landscape layout when phone has nearly finished rotating.
    iphone.classList.toggle("is-landscape", turn > 0.96);

    if (mobileHeading) {
      mobileHeading.style.opacity = String(
        1 - phase(p, 0.25, 0.45)
      );
    }

    if (mobileProgress) {
      mobileProgress.style.width = `${(p * 100).toFixed(1)}%`;
    }

    if (mobileCaption) {
      mobileCaption.textContent =
        p < 0.42
          ? "COMPLETE CV · PORTRAIT VIEW"
          : p < 0.76
            ? "COMPLETE CV · LANDSCAPE VIEW"
            : "RESPONSIVE BY DESIGN";
    }
  }

  let scheduled = false;

  function update() {
    scheduled = false;
    if (reduceMotion) return;

    updateDesktop(getProgress(desktopSection));
    updateMobile(getProgress(mobileSection));
  }

  function requestUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);

  if (reduceMotion) {
    if (laptop) {
      laptop.style.setProperty("--laptop-scale", laptopScale());
      laptop.style.setProperty("--laptop-opacity", "1");
    }
    if (iphone) {
      iphone.style.setProperty("--phone-scale", phonePortraitScale());
      iphone.style.setProperty("--phone-opacity", "1");
    }
  } else {
    update();
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
});
