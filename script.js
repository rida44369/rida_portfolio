
// ========================================
// RIDA FATIMA PORTFOLIO
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // HERO TEXT ENTRANCE
  // Astronaut animation is controlled by CSS.

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
          {
            opacity: 0,
            transform: "translateY(25px)"
          },
          {
            opacity: 1,
            transform: "translateY(0)"
          }
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

  // SCROLL SECTION REVEALS

  if (!reduceMotion && "IntersectionObserver" in window) {
    const sections = document.querySelectorAll(
      ".content-section"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.animate(
            [
              {
                opacity: 0.6,
                transform: "translateY(25px)"
              },
              {
                opacity: 1,
                transform: "translateY(0)"
              }
            ],
            {
              duration: 700,
              easing: "ease-out",
              fill: "both"
            }
          );

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
  }

  // CONTACT FORM
  // Opens the user's email app.
  // It does not send the email automatically.

  const contactForm = document.querySelector("#contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const formData = new FormData(contactForm);

      const name = String(formData.get("name")).trim();
      const email = String(formData.get("email")).trim();
      const subject = String(formData.get("subject")).trim();
      const message = String(formData.get("message")).trim();

      const body =
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `Message:\n${message}`;

      const mailto =
        "mailto:rida44369@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;
    });
  }

  // FOOTER YEAR

  const year = document.querySelector("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

});
