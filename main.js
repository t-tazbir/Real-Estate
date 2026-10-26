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

    // The steps share a sticky track: each next card moves from the viewport
    // bottom to the top while the preceding step remains pinned beneath it.
    // Separate progress values drive the card, copy, and image parallax layers.
    const processSteps = Array.from(document.querySelectorAll(".process-step"));
    const reduceProcessMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateProcessStack() {
      if (!processSteps.length) return;
      // Match the travel distance to the actual 100svh card height. On mobile
      // this stays aligned with the stable small viewport as browser chrome moves.
      const viewportH = processSteps[0].getBoundingClientRect().height
        || window.innerHeight
        || document.documentElement.clientHeight;
      if (!viewportH) return;

      const stepTops = processSteps.map((step) => step.getBoundingClientRect().top);
      processSteps.forEach((step, index) => {
        const item = step.querySelector(".process-item");
        step.style.setProperty("--process-layer", String(index + 1));
        if (!item) return;

        // A step enters while its top moves from the viewport bottom to 0.
        const stepTop = stepTops[index];
        const enterProgress = Math.max(0, Math.min(1, 1 - Math.max(0, stepTop) / viewportH));
        const next = processSteps[index + 1];
        const exitProgress = next
          ? Math.max(0, Math.min(1, 1 - stepTops[index + 1] / viewportH))
          : 0;
        const enter = reduceProcessMotion.matches ? 1 : enterProgress;
        const exit = reduceProcessMotion.matches ? 0 : exitProgress;

        // Anchor the card to its step's viewport position, then translate it
        // from one full viewport below to the pinned top using scroll progress.
        // Reduced motion keeps it in normal step flow and removes that travel.
        const stepAnchor = reduceProcessMotion.matches ? 0 : -Math.max(0, stepTop);
        step.style.setProperty("--process-step-anchor", `${stepAnchor.toFixed(1)}px`);
        item.style.setProperty("--process-enter-progress", enter.toFixed(3));
        item.style.setProperty("--process-exit-progress", exit.toFixed(3));
        item.style.setProperty("--process-enter-translate", `${((1 - enter) * viewportH).toFixed(1)}px`);
        item.style.setProperty("--process-card-y", `${(10 * (1 - enter) - 14 * exit).toFixed(1)}px`);
        item.style.setProperty("--process-content-y", `${(34 * (1 - enter) - 48 * exit).toFixed(1)}px`);
        item.style.setProperty("--process-progress", exit.toFixed(3));

        const image = step.querySelector(".process-image");
        if (image) {
          // Counter-move the enlarged image by 8% of its own height as the
          // card enters, then add a small outgoing drift as the next card covers it.
          const imageShift = reduceProcessMotion.matches ? 0 : 8 * (0.5 - enter) - 1.75 * exit;
          image.style.setProperty("--process-image-shift", `${imageShift.toFixed(2)}%`);
        }
      });
    }

    let scrollFrame = 0;
    function requestScrollUpdate() {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        updateScrollEffects();
        updateProjectShift();
        updateProcessStack();
        scrollFrame = 0;
      });
    }
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);
    if (reduceProcessMotion.addEventListener) {
      reduceProcessMotion.addEventListener("change", requestScrollUpdate);
    } else {
      reduceProcessMotion.addListener?.(requestScrollUpdate);
    }
    updateScrollEffects();
    updateProjectShift();
    updateProcessStack();

    // Five original collection images with one clone at each end make the
    // transition continuous; the clones are snapped past after their motion.
    const collectionViewport = document.querySelector(".collection-viewport");
    const collectionTrack = document.querySelector(".collection-track");
    const collectionPrevious = document.querySelector(".collection-previous");
    const collectionNext = document.querySelector(".collection-next");
    const collectionStatus = document.querySelector(".collection-status");
    const collectionSlides = collectionTrack
      ? Array.from(collectionTrack.querySelectorAll(".collection-slide"))
      : [];

    if (collectionViewport && collectionTrack && collectionSlides.length === 5) {
      const makeCollectionClone = (slide) => {
        const clone = slide.cloneNode(true);
        clone.dataset.clone = "true";
        clone.setAttribute("aria-hidden", "true");
        clone.removeAttribute("aria-label");
        const image = clone.querySelector("img");
        if (image) image.alt = "";
        return clone;
      };

      collectionTrack.insertBefore(makeCollectionClone(collectionSlides[4]), collectionSlides[0]);
      collectionTrack.append(makeCollectionClone(collectionSlides[0]));
      let collectionIndex = 1;
      let collectionMoving = false;

      function updateCollectionState() {
        const realIndex = (collectionIndex - 1 + collectionSlides.length) % collectionSlides.length;
        Array.from(collectionTrack.children).forEach((slide, index) => {
          slide.classList.toggle("is-active", index === collectionIndex);
          slide.classList.toggle("is-previous", index === collectionIndex - 1);
          slide.classList.toggle("is-next", index === collectionIndex + 1);
        });
        collectionSlides.forEach((slide, index) => {
          slide.setAttribute("aria-hidden", String(index !== realIndex));
        });
        collectionStatus.textContent = `Image ${realIndex + 1} of ${collectionSlides.length}`;
      }

      function updateCollectionOffset(animate = true) {
        const activeSlide = collectionTrack.children[collectionIndex];
        if (!activeSlide) return;
        collectionTrack.classList.toggle("is-snapping", !animate);
        const slotWidth = collectionViewport.clientWidth / 3;
        collectionTrack.style.setProperty("--collection-slot-width", `${slotWidth.toFixed(2)}px`);
        const slideCenter = activeSlide.offsetLeft + activeSlide.offsetWidth / 2;
        const offset = collectionViewport.clientWidth / 2 - slideCenter;
        collectionTrack.style.setProperty("--collection-offset", `${offset.toFixed(1)}px`);
        if (!animate) {
          // Commit the no-transition position before restoring animated moves.
          void collectionTrack.offsetWidth;
          requestAnimationFrame(() => collectionTrack.classList.remove("is-snapping"));
        }
      }

      function finishCollectionMove() {
        if (collectionIndex === 0) collectionIndex = collectionSlides.length;
        if (collectionIndex === collectionSlides.length + 1) collectionIndex = 1;
        updateCollectionState();
        updateCollectionOffset(false);
        collectionMoving = false;
        collectionPrevious.disabled = false;
        collectionNext.disabled = false;
      }

      function moveCollection(direction) {
        if (collectionMoving) return;
        collectionMoving = true;
        collectionPrevious.disabled = true;
        collectionNext.disabled = true;
        collectionIndex += direction;
        updateCollectionState();
        updateCollectionOffset(!reduceProcessMotion.matches);
        if (reduceProcessMotion.matches) finishCollectionMove();
      }

      collectionTrack.addEventListener("transitionend", (event) => {
        if (event.target === collectionTrack && event.propertyName === "transform" && collectionMoving) {
          finishCollectionMove();
        }
      });
      collectionPrevious.addEventListener("click", () => moveCollection(-1));
      collectionNext.addEventListener("click", () => moveCollection(1));
      updateCollectionState();
      updateCollectionOffset(false);

      function handleCollectionResize() {
        if (collectionMoving) finishCollectionMove();
        else updateCollectionOffset(false);
      }

      if ("ResizeObserver" in window) {
        const collectionResizeObserver = new ResizeObserver(handleCollectionResize);
        collectionResizeObserver.observe(collectionViewport);
      } else {
        window.addEventListener("resize", handleCollectionResize);
      }
      reduceProcessMotion.addEventListener?.("change", () => {
        if (reduceProcessMotion.matches && collectionMoving) finishCollectionMove();
      });
    }


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
