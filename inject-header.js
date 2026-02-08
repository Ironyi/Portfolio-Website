document.addEventListener("DOMContentLoaded", function () {
  const normalizePath = (path) => {
    if (!path) return "/";
    let normalized = path.split("?")[0].split("#")[0];
    if (normalized === "/index.html") normalized = "/";
    if (normalized.endsWith("/index.html")) {
      normalized = normalized.replace(/index\.html$/, "");
    }
    if (normalized.length > 1 && normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }
    return normalized || "/";
  };

  // Load header from header.html into placeholder
  fetch("/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header-placeholder").innerHTML = data;

      // Highlight current nav link
      const currentPath = normalizePath(window.location.pathname);
      const navLinks = document.querySelectorAll(".nav-links a");

      navLinks.forEach(link => {
        const href = link.getAttribute("href");
        const linkPath = normalizePath(new URL(href, window.location.origin).pathname);
        if (linkPath === currentPath) {
          link.classList.add("active");
        }

        // Collapse mobile menu after selecting a destination.
        link.addEventListener("click", () => {
          const navMenu = document.getElementById("navMenu");
          const toggle = document.querySelector(".menu-toggle");
          if (navMenu) {
            navMenu.classList.remove("active");
          }
          if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
          }
        });
      });

      const menuToggle = document.querySelector(".menu-toggle");
      const navMenu = document.getElementById("navMenu");

      // Close open mobile menu when clicking outside the header.
      document.addEventListener("click", (event) => {
        if (!menuToggle || !navMenu) return;
        if (!navMenu.classList.contains("active")) return;
        if (menuToggle.contains(event.target) || navMenu.contains(event.target)) return;
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });

      // Now that the header is injected, run scroll logic
      let lastScrollY = window.scrollY;
      let ticking = false;
      const header = document.querySelector(".site-header");
      const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;

      function updateHeaderVisibility() {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;

        // Ignore tiny scroll fluctuations that cause visual jitter.
        if (Math.abs(delta) < 6) {
          ticking = false;
          return;
        }

        if (currentScrollY <= 100) {
          header.classList.remove("hidden");
        } else if (delta > 0) {
          header.classList.add("hidden");
        } else {
          header.classList.remove("hidden");
        }

        lastScrollY = currentScrollY;
        ticking = false;
      }

      // Avoid hide/reveal scroll work on small screens to reduce jank.
      if (!isMobileViewport) {
        window.addEventListener("scroll", () => {
          if (!ticking) {
            window.requestAnimationFrame(updateHeaderVisibility);
            ticking = true;
          }
        }, { passive: true });
      }
    });

  // Load footer from footer.html into placeholder (skip on home page)
  const currentPath = normalizePath(window.location.pathname);
  if (currentPath !== "/") {
    fetch("/footer.html")
      .then(res => res.text())
      .then(data => {
        // Create footer placeholder if it doesn't exist
        let footerPlaceholder = document.getElementById("footer-placeholder");
        if (!footerPlaceholder) {
          footerPlaceholder = document.createElement("div");
          footerPlaceholder.id = "footer-placeholder";
          document.body.appendChild(footerPlaceholder);
        }
        footerPlaceholder.innerHTML = data;
      })
      .catch(err => console.log("Footer not found, skipping..."));
  }
});
