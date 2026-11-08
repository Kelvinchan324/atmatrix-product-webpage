const storageKey = "atmatrix-iot-demo-followed";
const cards = [...document.querySelectorAll(".idea-card")];
const filters = [...document.querySelectorAll(".filter")];
const count = document.querySelector("#interest-count");
const toast = document.querySelector(".toast");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector("#site-nav");

let followed = new Set();
try {
  followed = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
} catch {
  followed = new Set();
}

function saveFollowed() {
  localStorage.setItem(storageKey, JSON.stringify([...followed]));
  count.textContent = followed.size;
}

function updateButton(card) {
  const button = card.querySelector(".vote-button");
  const active = followed.has(card.dataset.idea);
  button.setAttribute("aria-pressed", String(active));
  button.innerHTML = active ? "<span>♥</span> Following" : "<span>♡</span> Follow idea";
}

function announce(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(announce.timer);
  announce.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

cards.forEach((card) => {
  updateButton(card);

  card.querySelector(".vote-button").addEventListener("click", () => {
    const id = card.dataset.idea;
    const title = card.querySelector("h3").textContent;
    if (followed.has(id)) {
      followed.delete(id);
      announce(`${title} removed from your followed ideas.`);
    } else {
      followed.add(id);
      announce(`${title} added. This choice is stored only in this browser.`);
    }
    updateButton(card);
    saveFollowed();
  });

  card.querySelector(".details-button").addEventListener("click", (event) => {
    const detail = card.querySelector(".idea-detail");
    const opening = detail.hidden;
    detail.hidden = !opening;
    event.currentTarget.innerHTML = opening ? "Hide brief <span>↙</span>" : "View brief <span>↗</span>";
  });
});

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    filter.classList.add("active");
    const selected = filter.dataset.filter;
    cards.forEach((card) => card.classList.toggle("is-hidden", selected !== "all" && card.dataset.category !== selected));
  });
});

menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

nav.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
});

saveFollowed();
