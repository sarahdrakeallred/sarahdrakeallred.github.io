const params = new URLSearchParams(window.location.search);
const requestedProject = params.get("project") || "geo";
const projects = Object.fromEntries(window.portfolioContent.projects.map((project) => [project.id, project]));
const project = projects[requestedProject] || projects.geo;
const contentItems = project.content;
const textItems = contentItems.filter((item) => item.type === "text");
const processHeadingItem = contentItems.find((item) => item.type === "text" && /^How (I|we) approached the project$/i.test(item.text));

document.title = `${project.title} — Sarah Drake Allred`;
document.querySelector("#projectKicker").textContent = project.kicker;
document.querySelector("#projectTitle").textContent = project.title;
document.querySelector("#projectSubtitle").textContent = project.subtitle;
document.querySelector("#projectLede").textContent = textItems[0].text;
document.querySelector("#projectProcessHeading").textContent = processHeadingItem?.text || "How I approached the project";

function textForLabel(label) {
  const item = textItems.find((entry) => entry.text.startsWith(`${label}:`));
  return item ? item.text.slice(label.length + 1).trim() : "";
}

document.querySelector("#projectProblem").textContent = textForLabel("The problem");
document.querySelector("#projectSolution").textContent = textForLabel("The solution");
document.querySelector("#projectRole").textContent = textForLabel("My role");
document.querySelector("#projectSkills").textContent = textForLabel("Skills demonstrated");

const processStart = contentItems.indexOf(processHeadingItem);
const processItems = processStart >= 0 ? contentItems.slice(processStart + 1) : contentItems;
const slides = [];
let pendingStory = "";

function splitProcessText(text, fallback) {
  const separator = text.indexOf(":");
  if (separator > 0) {
    return {
      heading: text.slice(0, separator).trim(),
      story: text.slice(separator + 1).trim()
    };
  }

  return { heading: "", story: text || fallback };
}

processItems.forEach((item) => {
  if (item.type === "image" || item.type === "video") {
    const processText = splitProcessText(pendingStory, item.caption);
    slides.push({ ...item, ...processText });
    pendingStory = "";
  } else if (item.type === "text") {
    pendingStory = item.text;
  }
});

const lightboxItems = slides
  .filter((item) => item.type === "image")
  .map((item) => ({ src: item.src, alt: item.alt }));

window.projectLightboxItems = lightboxItems;

const image = document.querySelector("#projectCarouselImage");
const imageLink = document.querySelector("#projectCarouselLink");
const videoFrame = document.querySelector("#projectVideoFrame");
const video = document.querySelector("#projectCarouselVideo");
const stepHeading = document.querySelector("#projectStepHeading");
const caption = document.querySelector("#projectCarouselCaption");
const count = document.querySelector("#projectCarouselCount");
let currentIndex = 0;

function renderSlide(nextIndex) {
  currentIndex = (nextIndex + slides.length) % slides.length;
  const current = slides[currentIndex];
  const isVideo = current.type === "video";
  imageLink.hidden = isVideo;
  videoFrame.hidden = !isVideo;

  if (isVideo) {
    video.src = current.src;
    video.title = current.alt;
  } else {
    const displaySrc = current.src.endsWith(".jpg")
      ? current.src.replace("assets/web/", "assets/web/display/")
      : current.src;
    image.src = displaySrc;
    image.alt = current.alt;
    imageLink.href = current.src;
    imageLink.setAttribute("aria-label", `Enlarge ${current.alt}`);
    imageLink.dataset.lightboxIndex = String(lightboxItems.findIndex((item) => item.src === current.src));
    video.src = "about:blank";
  }

  stepHeading.textContent = current.heading;
  stepHeading.hidden = !current.heading;
  caption.textContent = current.story;
  count.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
}

window.setProjectSlideBySource = (source) => {
  const slideIndex = slides.findIndex((item) => item.type === "image" && item.src === source);
  if (slideIndex >= 0) renderSlide(slideIndex);
};

document.querySelectorAll("[data-direction]").forEach((button) => {
  button.addEventListener("click", () => {
    renderSlide(currentIndex + (button.dataset.direction === "next" ? 1 : -1));
  });
});

renderSlide(0);
