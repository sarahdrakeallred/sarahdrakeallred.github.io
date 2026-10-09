const heroTrigger = document.querySelector("[data-hero-lightbox-trigger]");
const heroLightbox = document.querySelector("#heroImageLightbox");
const heroLightboxImage = document.querySelector("#heroLightboxImage");
const heroLightboxClose = document.querySelector("[data-hero-lightbox-close]");

if (heroTrigger && heroLightbox && heroLightboxImage) {
  heroTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    const sourceImage = heroTrigger.querySelector("img");
    heroLightboxImage.src = heroTrigger.href;
    heroLightboxImage.alt = sourceImage?.alt || "";
    heroLightbox.showModal();
  });

  heroLightboxClose?.addEventListener("click", () => heroLightbox.close());

  heroLightbox.addEventListener("click", (event) => {
    if (event.target === heroLightbox) {
      heroLightbox.close();
    }
  });

  heroLightbox.addEventListener("close", () => {
    heroLightboxImage.removeAttribute("src");
  });
}
