const lightbox = document.querySelector("#imageLightbox");

if (lightbox) {
  const lightboxImage = document.querySelector("#lightboxImage");
  const closeButton = document.querySelector("[data-lightbox-close]");

  document.querySelectorAll("[data-lightbox-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const sourceImage = trigger.querySelector("img");
      lightboxImage.src = trigger.href;
      lightboxImage.alt = sourceImage?.alt || "Enlarged portfolio image";
      lightbox.showModal();
    });
  });

  closeButton.addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}
