document.addEventListener("DOMContentLoaded", function() {
    const navWidget = document.querySelector(".nav-widget");
    const dragHint = document.querySelector(".drag-hint");
    const sections = document.querySelectorAll("section");
    const scrollToTopBtn = document.createElement('button');

    // Create and append scroll-to-top button
    scrollToTopBtn.id = 'scrollToTopBtn';
    scrollToTopBtn.innerHTML = '&uarr;'; // Up arrow
    document.body.appendChild(scrollToTopBtn);

    let hoverTimeout;

    navWidget.addEventListener("mouseenter", () => {
      hoverTimeout = setTimeout(() => {
        dragHint.classList.add("show");
      }, 1000); // 1 second delay
    });

    navWidget.addEventListener("mouseleave", () => {
      clearTimeout(hoverTimeout);
      dragHint.classList.remove("show");
    });

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

    // Make nav-widget draggable and snappable
    let isDragging = false;
    let offsetX, offsetY;

    navWidget.addEventListener('mousedown', (e) => {
      isDragging = true;
      navWidget.style.cursor = 'grabbing';
      offsetX = e.clientX - navWidget.getBoundingClientRect().left;
      offsetY = e.clientY - navWidget.getBoundingClientRect().top;
      navWidget.style.transition = 'none'; // Disable transition during drag
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;

      // Keep widget within viewport bounds
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - navWidget.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - navWidget.offsetHeight));

      navWidget.style.left = `${newLeft}px`;
      navWidget.style.top = `${newTop}px`;
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        navWidget.style.cursor = 'grab';
        navWidget.style.transition = 'left 0.3s ease-in-out, right 0.3s ease-in-out, top 0.3s ease-in-out'; // Re-enable transition

        const widgetRect = navWidget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        // Determine which side to snap to
        if (widgetRect.left + widgetRect.width / 2 < viewportWidth / 2) {
          // Snap to left
          navWidget.style.left = '30px';
          navWidget.style.right = 'auto';
        } else {
          // Snap to right
          navWidget.style.right = '30px';
          navWidget.style.left = 'auto';
        }

        // Ensure top position is valid after snap
        let currentTop = parseFloat(navWidget.style.top);
        if (currentTop < 0) {
          navWidget.style.top = '0px';
        } else if (currentTop + widgetRect.height > window.innerHeight) {
          navWidget.style.top = `${window.innerHeight - widgetRect.height}px`;
        }
      }
    });
});
