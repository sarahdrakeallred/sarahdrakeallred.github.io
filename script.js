const projects = Object.fromEntries(window.portfolioContent.projects.map((project) => [project.id, project]));
const featuredCarouselImage = document.querySelector("#featuredCarouselImage");
const featuredCarouselLink = document.querySelector("#featuredCarouselLink");
const featuredCarouselCaption = document.querySelector("#featuredCarouselCaption");
const featuredCarouselCount = document.querySelector("#featuredCarouselCount");

const geoHomepageImage = {
  type: "image",
  src: "assets/web/geo-homepage-hero.png",
  alt: "GEO Department Onboarding course overview",
  caption: "GEO Department Onboarding course overview"
};

function imageItems(project) {
  return project.content.filter((item) => item.type === "image");
}

function featuredImageItems(project) {
  const images = imageItems(project);
  return project.id === "geo" ? [geoHomepageImage, ...images] : images;
}

function showCarouselImage(project, index, imageElement, captionElement, countElement) {
  const images = featuredImageItems(project);
  const safeIndex = (index + images.length) % images.length;
  const item = images[safeIndex];
  imageElement.src = item.src;
  imageElement.alt = item.alt;
  if (imageElement === featuredCarouselImage && featuredCarouselLink) {
    featuredCarouselLink.href = "project.html?project=geo";
    featuredCarouselLink.setAttribute("aria-label", "Open the GEO onboarding project");
  }
  captionElement.textContent = item.caption;
  countElement.textContent = `${String(safeIndex + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;
  return safeIndex;
}

let activeIndex = showCarouselImage(projects.geo, 0, featuredCarouselImage, featuredCarouselCaption, featuredCarouselCount);

document.querySelectorAll("[data-featured-dir]").forEach((button) => {
  button.addEventListener("click", () => {
    activeIndex += button.dataset.featuredDir === "next" ? 1 : -1;
    activeIndex = showCarouselImage(projects.geo, activeIndex, featuredCarouselImage, featuredCarouselCaption, featuredCarouselCount);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
