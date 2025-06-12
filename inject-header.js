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
      });

      // Now that the header is injected, run scroll logic
      let lastScrollY = window.scrollY;
      let ticking = false;
      const header = document.querySelector(".site-header");

      function updateHeaderVisibility() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
          if (currentScrollY > lastScrollY) {
            header.classList.add("hidden");
          } else {
            header.classList.remove("hidden");
          }
        }

        lastScrollY = currentScrollY;
        ticking = false;
      }

      window.addEventListener("scroll", () => {
        if (!ticking) {
          window.requestAnimationFrame(updateHeaderVisibility);
          ticking = true;
        }
      });
    });
});
