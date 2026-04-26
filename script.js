const header = document.querySelector(".site-header");
const toggleButton = document.querySelector(".nav-toggle");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const faqButtons = document.querySelectorAll(".faq-question");
const revealTargets = document.querySelectorAll("[data-reveal]");
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

/* ============================================================
   Mobile Nav Toggle
   ============================================================ */

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

/* ============================================================
   FAQ Accordion
   ============================================================ */

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

/* ============================================================
   Scroll Reveal (IntersectionObserver)
   ============================================================ */

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
   Sticky Bottom CTA Bar
   ============================================================ */
const stickyCta = document.getElementById("sticky-cta");
const stickyClose = stickyCta ? stickyCta.querySelector(".sticky-cta-close") : null;
const heroSection = document.getElementById("top");

if (stickyCta && heroSection && "IntersectionObserver" in window) {
  if (!sessionStorage.getItem("ctaBarDismissed")) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        const heroVisible = entries[0].isIntersecting;
        stickyCta.classList.toggle("visible", !heroVisible);
        stickyCta.setAttribute("aria-hidden", String(heroVisible));
        stickyCta.querySelectorAll("a, button").forEach((el) => {
          el.setAttribute("tabindex", heroVisible ? "-1" : "0");
        });
        document.body.classList.toggle("sticky-cta-active", !heroVisible);
      },
      { threshold: 0.1 }
    );
    heroObserver.observe(heroSection);
  }

  if (stickyClose) {
    stickyClose.addEventListener("click", () => {
      stickyCta.classList.remove("visible");
      stickyCta.setAttribute("aria-hidden", "true");
      sessionStorage.setItem("ctaBarDismissed", "1");
      document.body.classList.remove("sticky-cta-active");
    });
  }
}

/* ============================================================
   FAQ Audience Tab Filter
   ============================================================ */
const faqTabList = document.querySelector(".faq-tabs");
const faqItems = document.querySelectorAll(".faq-item[data-audience]");

if (faqTabList && faqItems.length) {
  faqTabList.addEventListener("click", (e) => {
    const tab = e.target.closest(".faq-tab");
    if (!tab) return;

    const filter = tab.dataset.filter;

    faqTabList.querySelectorAll(".faq-tab").forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    faqItems.forEach((item) => {
      const audience = item.dataset.audience;
      const show = filter === "all" || audience === filter || audience === "all";
      item.hidden = !show;

      if (!show && item.querySelector(".faq-question").getAttribute("aria-expanded") === "true") {
        item.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        const answer = item.querySelector(".faq-answer");
        if (answer) answer.style.maxHeight = null;
      }
    });
  });
}

/* ============================================================
   Video Play Overlay + Tracking
   ============================================================ */
const pitchVideo = document.getElementById("pitch-video-player");
const playBtn = document.getElementById("video-play-btn");

if (pitchVideo && playBtn) {
  playBtn.addEventListener("click", () => {
    playBtn.classList.add("is-hidden");
    pitchVideo.play();
    // Track video play event
    console.log("[Civic Launch] Video play event triggered");
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
