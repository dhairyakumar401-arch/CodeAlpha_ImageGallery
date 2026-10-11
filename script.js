
const galleryGrid = document.getElementById("galleryGrid");
const cards = [...document.querySelectorAll(".photo-card")];
const filters = document.querySelectorAll(".filter");
const searchInput = document.getElementById("searchInput");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let activeCategory = "all";
let currentCardIndex = 0;
let visibleCards = [];

// Filter and search
function updateGallery() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  cards.forEach(card => {
    const category = card.dataset.category;
    const title = card.querySelector("h3").textContent.toLowerCase();
    const alt = card.querySelector("img").alt.toLowerCase();

    const matchesCategory =
      activeCategory === "all" || category === activeCategory;

    const matchesSearch =
      title.includes(searchTerm) || alt.includes(searchTerm) ||
      category.includes(searchTerm);

    card.hidden = !(matchesCategory && matchesSearch);
  });

  visibleCards = cards.filter(card => !card.hidden);
}

filters.forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;

    filters.forEach(filter => filter.classList.remove("active"));
    button.classList.add("active");

    updateGallery();
  });
});

searchInput.addEventListener("input", updateGallery);

// Favorites
document.querySelectorAll(".favorite").forEach(button => {
  button.addEventListener("click", event => {
    event.stopPropagation();

    const isLiked = button.classList.toggle("liked");
    button.textContent = isLiked ? "♥" : "♡";
    button.setAttribute("aria-pressed", String(isLiked));
    button.setAttribute(
      "aria-label",
      isLiked ? "Remove from favorites" : "Add to favorites"
    );
  });
});

// Lightbox
function showImage(index) {
  if (!visibleCards.length) return;

  currentCardIndex = (index + visibleCards.length) % visibleCards.length;

  const card = visibleCards[currentCardIndex];
  const img = card.querySelector("img");
  const title = card.querySelector("h3").textContent;
  const category = card.dataset.category;

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = `${title} — ${category}`;
}

function openLightbox(card) {
  visibleCards = cards.filter(item => !item.hidden);

  const index = visibleCards.indexOf(card);
  if (index < 0) return;

  showImage(index);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeBtn.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

cards.forEach(card => {
  card.addEventListener("click", () => openLightbox(card));
});

prevBtn.addEventListener("click", () => {
  showImage(currentCardIndex - 1);
});

nextBtn.addEventListener("click", () => {
  showImage(currentCardIndex + 1);
});

closeBtn.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showImage(currentCardIndex - 1);
  if (event.key === "ArrowRight") showImage(currentCardIndex + 1);
});

// Initial setup
updateGallery();
