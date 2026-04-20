const header = document.querySelector(".site-header");
const toggleButton = document.querySelector(".nav-toggle");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const faqButtons = document.querySelectorAll(".faq-question");
const revealTargets = document.querySelectorAll("[data-reveal]");
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (toggleButton && header) {
  toggleButton.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("menu-open");
      toggleButton.setAttribute("aria-expanded", "false");
    });
  });
}

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    faqButtons.forEach((otherButton) => {
      const answer = otherButton.nextElementSibling;
      otherButton.setAttribute("aria-expanded", "false");
      if (answer) {
        answer.style.maxHeight = null;
      }
    });

    if (!isExpanded) {
      const answer = button.nextElementSibling;
      button.setAttribute("aria-expanded", "true");
      if (answer) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    }
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (!visibleEntries.length) {
        return;
      }

      const activeId = visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0].target.id;

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeId}`;
        link.setAttribute("aria-current", isActive ? "true" : "false");
        if (isActive) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    },
    {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: "-10% 0px -10% 0px"
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

/* ============================================================
   Video Play Overlay
   ============================================================ */
const pitchVideo = document.getElementById("pitch-video");
const playBtn = document.getElementById("video-play-btn");

if (pitchVideo && playBtn) {
  playBtn.addEventListener("click", () => {
    playBtn.classList.add("is-hidden");
    pitchVideo.play();
  });

  pitchVideo.addEventListener("pause", () => {
    if (!pitchVideo.ended) {
      playBtn.classList.remove("is-hidden");
    }
  });

  pitchVideo.addEventListener("ended", () => {
    playBtn.classList.remove("is-hidden");
  });

  pitchVideo.addEventListener("play", () => {
    playBtn.classList.add("is-hidden");
  });
}
