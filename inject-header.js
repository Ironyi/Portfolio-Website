document.addEventListener("DOMContentLoaded", function () {
  // Load header from header.html into placeholder
  fetch("header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header-placeholder").innerHTML = data;

      // Highlight current nav link
      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      const navLinks = document.querySelectorAll(".nav-links a");

      navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPage) {
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
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  if (currentPage !== "index.html") {
    fetch("footer.html")
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
