document.addEventListener("DOMContentLoaded", () => {
    const navWidget = document.querySelector(".nav-widget");
    const sections = document.querySelectorAll("section");
    const scrollToTopBtn = document.createElement('button');

    // Create and append scroll-to-top button
    scrollToTopBtn.id = 'scrollToTopBtn';
    scrollToTopBtn.innerHTML = '&uarr;'; // Up arrow
    document.body.appendChild(scrollToTopBtn);

    navWidget.addEventListener("click", () => {
      navWidget.classList.toggle("expanded");
    });



    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            entry.target.classList.add("hidden");
          } else {
            entry.target.classList.remove("hidden");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    document.querySelectorAll(".nav-links a").forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        navWidget.classList.remove("expanded");
        const targetId = this.getAttribute("href");
        const targetSection = document.querySelector(targetId);
        targetSection.scrollIntoView({
          behavior: "smooth",
        });
        // Close nav widget after clicking a link
        if (navWidget.classList.contains('expanded')) {
            navWidget.classList.remove('expanded');
        }
      });
    });

    // Show/hide scroll-to-top button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document
      .getElementById("contactForm")
      .addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const formStatus = document.getElementById("formStatus");

        const mailtoLink = `mailto:clifford242526@gmail.com?subject=Portfolio Contact: ${formData.get(
          "name"
        )}&body=From: ${formData.get(
          "email"
        )}%0D%0A%0D%0A${formData.get(
          "message"
        )}`;

        try {
          window.location.href = mailtoLink;

          formStatus.textContent = "Opening your email client...";
          formStatus.className = "form-status success";

          this.reset();
        } catch (error) {
          formStatus.textContent =
            "Error sending message. Please try again or email directly.";
          formStatus.className = "form-status error";
        }
      });

    document.querySelectorAll(".highlight-card").forEach((card) => {
      card.addEventListener("click", function () {
        const gallery = this.querySelector(".photo-gallery");
        const allGalleries = document.querySelectorAll(".photo-gallery");

        allGalleries.forEach((g) => {
          if (g !== gallery) g.classList.remove("active");
        });

        gallery.classList.toggle("active");
      });
    });


  });
