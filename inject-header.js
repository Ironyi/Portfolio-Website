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
