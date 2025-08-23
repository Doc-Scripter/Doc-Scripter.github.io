document.addEventListener("DOMContentLoaded", function() {
    const navWidget = document.querySelector(".nav-widget");
    const dragHint = document.querySelector(".drag-hint");
    const sections = document.querySelectorAll("section");


    // Navigation arrows for small screens
    const navArrows = document.querySelector('.nav-arrows');
    const prevArrow = document.querySelector('.nav-arrow.prev');
    const nextArrow = document.querySelector('.nav-arrow.next');

    let currentSectionIndex = 0;

    function updateNavArrows() {
        if (currentSectionIndex === 0) {
            prevArrow.style.display = 'none';
        } else {
            prevArrow.style.display = 'block';
        }

        if (currentSectionIndex === sections.length - 1) {
            nextArrow.style.display = 'none';
        } else {
            nextArrow.style.display = 'block';
        }
    }

    prevArrow.addEventListener('click', () => {
        if (currentSectionIndex > 0) {
            currentSectionIndex--;
            sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
            updateNavArrows();
        }
    });

    nextArrow.addEventListener('click', () => {
        if (currentSectionIndex < sections.length - 1) {
            currentSectionIndex++;
            sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
            updateNavArrows();
        }
    });

    // Initial update
    updateNavArrows();

    // Update arrows on scroll
    window.addEventListener('scroll', () => {
        let newIndex = 0;
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                newIndex = index;
            }
        });
        if (newIndex !== currentSectionIndex) {
            currentSectionIndex = newIndex;
            updateNavArrows();
        }
    });

    // Hide nav-widget and show nav-arrows on small screens
    function handleScreenSizeChange() {
        if (window.innerWidth <= 425) {
            navWidget.style.display = 'none';
            navArrows.style.display = 'flex';
        } else {
            navWidget.style.display = 'flex';
            navArrows.style.display = 'none';
        }
    }

    // Initial check and add listener
    handleScreenSizeChange();
    window.addEventListener('resize', handleScreenSizeChange);

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
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: "smooth",
          });
        }
        // Close nav widget after clicking a link
        if (navWidget.classList.contains('expanded')) {
            navWidget.classList.remove('expanded');
        }
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
    let hasMoved = false; // New variable to track if actual dragging occurred

    navWidget.addEventListener('mousedown', (e) => {
      if (navWidget.classList.contains('expanded')) {
        return; // Do not allow dragging when expanded
      }
      isDragging = true;
      hasMoved = false; // Reset on mousedown
      navWidget.style.cursor = 'grabbing';
      offsetX = e.clientX - navWidget.getBoundingClientRect().left;
      offsetY = e.clientY - navWidget.getBoundingClientRect().top;
      navWidget.style.transition = 'none'; // Disable transition during drag
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      // Check if mouse has moved significantly to consider it a drag
      if (Math.abs(e.clientX - (navWidget.getBoundingClientRect().left + offsetX)) > 5 ||
          Math.abs(e.clientY - (navWidget.getBoundingClientRect().top + offsetY)) > 5) {
        hasMoved = true;
      }

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

        // Only apply snap logic if an actual drag occurred
        if (hasMoved) {
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
          if (currentTop < 40) {
            navWidget.style.top = '40px';
          } else if (currentTop + widgetRect.height > window.innerHeight) {
            navWidget.style.top = `${window.innerHeight - widgetRect.height}px`;
          }
        }
      }
    });
});
