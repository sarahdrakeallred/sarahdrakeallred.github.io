const lightbox = document.querySelector("#imageLightbox");

if (lightbox) {
  const lightboxImage = document.querySelector("#lightboxImage");
  const closeButton = document.querySelector("[data-lightbox-close]");
  const previousButton = document.querySelector("[data-lightbox-prev]");
  const nextButton = document.querySelector("[data-lightbox-next]");
  const count = document.querySelector("#lightboxCount");
  const triggers = Array.from(document.querySelectorAll("[data-lightbox-trigger]"));
  const projectItems = Array.isArray(window.projectLightboxItems) ? window.projectLightboxItems : [];
  const items = projectItems.length
    ? projectItems
    : triggers.map((trigger) => ({
        src: trigger.href,
        alt: trigger.querySelector("img")?.alt || "Enlarged portfolio image"
      }));
  let activeIndex = 0;
  let isZoomed = false;

  function resetZoom() {
    isZoomed = false;
    lightboxImage.classList.remove("is-zoomed");
    lightboxImage.style.removeProperty("--zoom-x");
    lightboxImage.style.removeProperty("--zoom-y");
    lightboxImage.setAttribute("aria-label", "Zoom image");
  }

  function renderLightboxImage(nextIndex) {
    if (!items.length) return;

    activeIndex = (nextIndex + items.length) % items.length;
    const item = items[activeIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt || "Enlarged portfolio image";
    count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
    resetZoom();

    if (typeof window.setProjectSlideBySource === "function") {
      window.setProjectSlideBySource(item.src);
    }
  }

  function toggleZoom(x = 50, y = 50) {
    if (!isZoomed) {
      lightboxImage.style.setProperty("--zoom-x", `${Math.max(0, Math.min(100, x))}%`);
      lightboxImage.style.setProperty("--zoom-y", `${Math.max(0, Math.min(100, y))}%`);
      isZoomed = true;
      lightboxImage.classList.add("is-zoomed");
      lightboxImage.setAttribute("aria-label", "Reset image zoom");
    } else {
      resetZoom();
    }
  }

  function openLightbox(trigger) {
    const sourceImage = trigger.querySelector("img");
    const triggerIndex = Number.parseInt(trigger.dataset.lightboxIndex, 10);
    const fallbackIndex = items.findIndex((item) => new URL(item.src, document.baseURI).href === trigger.href);
    activeIndex = Number.isInteger(triggerIndex) && triggerIndex >= 0
      ? triggerIndex
      : Math.max(0, fallbackIndex);
    renderLightboxImage(activeIndex);
    if (sourceImage?.alt && !items[activeIndex]?.alt) lightboxImage.alt = sourceImage.alt;
    lightbox.showModal();
    closeButton.focus();
  }

  previousButton.hidden = items.length < 2;
  nextButton.hidden = items.length < 2;
  count.hidden = items.length < 2;

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openLightbox(trigger);
    });
  });

  previousButton.addEventListener("click", () => renderLightboxImage(activeIndex - 1));
  nextButton.addEventListener("click", () => renderLightboxImage(activeIndex + 1));
  closeButton.addEventListener("click", () => lightbox.close());

  lightboxImage.addEventListener("click", (event) => {
    const bounds = lightboxImage.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    toggleZoom(x, y);
  });

  lightboxImage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleZoom();
    }
  });

  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && items.length > 1) renderLightboxImage(activeIndex - 1);
    if (event.key === "ArrowRight" && items.length > 1) renderLightboxImage(activeIndex + 1);
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  lightbox.addEventListener("close", resetZoom);
}
