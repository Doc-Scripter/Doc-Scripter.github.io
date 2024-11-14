document.addEventListener("DOMContentLoaded", () => {
    const navWidget = document.querySelector(".nav-widget");
    const sections = document.querySelectorAll("section");

    // Toggle nav widget expansion
    navWidget.addEventListener("click", () => {
      navWidget.classList.toggle("expanded");
    });

    // Intersection Observer for sections
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

    // Smooth scroll for navigation links
    document.querySelectorAll(".nav-links a").forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        navWidget.classList.remove("expanded");
        const targetId = this.getAttribute("href");
        const targetSection = document.querySelector(targetId);
        targetSection.scrollIntoView({
          behavior: "smooth",
        });
      });
    });

    document
      .getElementById("contactForm")
      .addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const formStatus = document.getElementById("formStatus");

        // Create email content
        const mailtoLink = `mailto:clifford242526@gmail.com?subject=Portfolio Contact: ${formData.get(
          "name"
        )}&body=From: ${formData.get("email")}%0D%0A%0D%0A${formData.get(
          "message"
        )}`;

        try {
          // Open default mail client
          window.location.href = mailtoLink;

          formStatus.textContent = "Opening your email client...";
          formStatus.className = "form-status success";

          // Clear form
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

        // Close other galleries
        allGalleries.forEach((g) => {
          if (g !== gallery) g.classList.remove("active");
        });

        // Toggle current gallery
        gallery.classList.toggle("active");
      });
    });
  });
