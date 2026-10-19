const menuToggle = document.querySelector(".menu-button");
    const mobilePanel = document.querySelector("#mobile-navigation");
    const mobileLinks = document.querySelectorAll(".mobile-link");
    const menuLabel = document.querySelector(".menu-label");
    const menuIcon = document.querySelector(".menu-icon");

    const siteHeader = document.querySelector("#site-header");
    // Keep the fixed header outside the hero and studio stacking/overflow contexts.
    document.body.append(siteHeader);
    // Place the mobile menu above the studio section's stacking context.
    document.body.append(mobilePanel);
    const studioSection = document.querySelector("#studio");
    const studioPhoto = document.querySelector(".studio-photo");
    const revealItems = document.querySelectorAll(".studio-reveal, .project-item");
    const finalStudioParagraph = document.querySelector(".studio-copy .studio-paragraph:last-of-type");
    const studioCta = document.querySelector(".studio-copy .studio-cta");

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);

          // Reveal the CTA with the final paragraph so it doesn't need a
          // separate scroll step to enter the viewport first.
          if (entry.target === finalStudioParagraph) {
            studioCta.classList.add("is-visible");
            revealObserver.unobserve(studioCta);
          }
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));

    const heroStage = document.querySelector(".hero-stage");
    const manifesto = document.querySelector("#studio-manifesto");
    const travellingWe = manifesto.querySelector(".travelling-we");
    const manifestoLines = Array.from(manifesto.querySelectorAll(".manifesto-line"));

    function updateScrollEffects() {
      const studioTop = studioSection.getBoundingClientRect().top;
      // Switch the desktop header after about 60% of the viewport has entered the studio.
      const studioTransition = window.innerWidth >= 1024 && studioTop <= window.innerHeight * 0.40;
      siteHeader.classList.toggle("is-studio", studioTransition);
      siteHeader.classList.toggle("is-light", studioTransition);
      const mobileHeaderLight = window.innerWidth < 1024 && studioTop <= window.innerHeight * 0.95;
      siteHeader.classList.toggle("is-mobile-light", mobileHeaderLight);

      // The hero drifts gently upward while the white panel overlaps it.
      const stageRect = heroStage.getBoundingClientRect();
      const stageProgress = Math.max(0, Math.min(1, -stageRect.top / (window.innerHeight * 0.20)));
      heroStage.style.setProperty("--hero-parallax", `${(stageProgress * -24).toFixed(1)}px`);
      heroStage.style.setProperty("--hero-content-shift", `${(stageProgress * -18).toFixed(1)}px`);

      // Subtle image parallax in the studio section.
      const photoRect = studioPhoto.getBoundingClientRect();
      if (photoRect.top < window.innerHeight && photoRect.bottom > 0) {
        const progress = (window.innerHeight - photoRect.top) / (window.innerHeight + photoRect.height);
        const parallaxDistance = window.innerWidth <= 767 ? 58 : 34;
        studioPhoto.style.setProperty("--photo-parallax", `${((progress - 0.5) * -parallaxDistance).toFixed(1)}px`);
      }

      // Start the word's travel when the manifesto enters, and finish when its
      // last line reaches the same viewport position. This keeps the motion
      // synchronized with the copy reveal instead of the whole section scroll.
      const manifestoRect = manifesto.getBoundingClientRect();
      const firstLine = manifestoLines[0].querySelector(".manifesto-text").getBoundingClientRect();
      const lastLine = manifestoLines[manifestoLines.length - 1].querySelector(".manifesto-text").getBoundingClientRect();
      const travelDistance = Math.max(1, lastLine.top - firstLine.top);
      const travelProgress = Math.max(0, Math.min(1,
        (window.innerHeight * 0.82 - firstLine.top) / (travelDistance * 1.2)
      ));
      const lineFloat = travelProgress * (manifestoLines.length - 1);
      const lineIndex = Math.min(manifestoLines.length - 1, Math.floor(lineFloat));
      const nextIndex = Math.min(manifestoLines.length - 1, lineIndex + 1);
      const blend = lineFloat - lineIndex;
      const first = manifestoLines[lineIndex].querySelector(".manifesto-text").getBoundingClientRect();
      const second = manifestoLines[nextIndex].querySelector(".manifesto-text").getBoundingClientRect();
      const weWidth = travellingWe.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(manifesto).fontSize) * 0.16;
      const x1 = first.left - manifestoRect.left - weWidth - gap;
      const y1 = first.top - manifestoRect.top;
      const x2 = second.left - manifestoRect.left - weWidth - gap;
      const y2 = second.top - manifestoRect.top;
      travellingWe.style.transform = `translate3d(${(x1 + (x2 - x1) * blend).toFixed(1)}px, ${(y1 + (y2 - y1) * blend).toFixed(1)}px, 0)`;
      manifesto.classList.toggle("is-tracking", manifestoRect.top < window.innerHeight * 0.95 && manifestoRect.bottom > 0);
    }
    // "What we do" accordion — one open at a time.
    const serviceItems = Array.from(document.querySelectorAll(".service-item"));
    serviceItems.forEach((item) => {
      const header = item.querySelector(".service-header");
      header.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        serviceItems.forEach((other) => {
          other.classList.remove("is-open");
          other.querySelector(".service-header").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("is-open");
          header.setAttribute("aria-expanded", "true");
        }
      });
    });

    const projectItems = Array.from(document.querySelectorAll(".project-item"));
    const MAX_PROJECT_SHIFT = 90; // px, desktop only

    function updateProjectShift() {
      if (!projectItems.length || window.innerWidth < 768) return;
      const viewportH = window.innerHeight;
      const viewportCenter = viewportH / 2;

      projectItems.forEach((item) => {
        const dir = item.dataset.dir === "left" ? -1 : 1;
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        // -1 (above center) .. 0 (centered) .. 1 (below center)
        const progress = Math.max(-1, Math.min(1, (itemCenter - viewportCenter) / viewportCenter));
        const shift = dir * progress * MAX_PROJECT_SHIFT;
        item.style.setProperty("--project-shift", `${shift.toFixed(1)}px`);
      });
    }

    let scrollFrame = 0;
    function requestScrollUpdate() {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        updateScrollEffects();
        updateProjectShift();
        scrollFrame = 0;
      });
    }
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);
    updateScrollEffects();
    updateProjectShift();


    function setMenu(open) {
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      menuLabel.textContent = open ? "Close" : "Menu";
      menuIcon.textContent = open ? "×" : "↗";
      mobilePanel.dataset.open = String(open);
      mobilePanel.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
    }

    menuToggle.addEventListener("click", () => {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) setMenu(false);
    });