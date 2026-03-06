const intro = document.getElementById("intro");
const introVideo = document.getElementById("introVideo");
const skipIntro = document.getElementById("skipIntro");
const tapToSound = document.getElementById("tapToSound");
const site = document.getElementById("site");
const floatingHarry = document.getElementById("floatingHarry");

// =========================
// INTRO VIDEO
// =========================
let soundEnabled = false;
let introDone = false;

function showSite() {
  if (introDone) return;
  introDone = true;

  intro.style.opacity = "0";
  intro.style.pointerEvents = "none";

  setTimeout(() => {
    intro.style.display = "none";
    site.classList.remove("hidden");
    window.scrollTo(0, 0);
    initReveal();
    initHarryFlight();
  }, 700);
}

function enableSoundOnce() {
  if (soundEnabled) return;
  soundEnabled = true;

  introVideo.muted = false;
  introVideo.volume = 1;
  introVideo.play().catch(() => {});

  if (tapToSound) tapToSound.style.display = "none";
}

if (introVideo) {
  introVideo.play().catch(() => {});
  introVideo.addEventListener("ended", showSite);
}

if (skipIntro) {
  skipIntro.addEventListener("click", showSite);
}

if (intro) {
  intro.addEventListener("click", enableSoundOnce);
  intro.addEventListener("touchstart", enableSoundOnce, { passive: true });
}

// =========================
// REVEAL
// =========================
function initReveal() {
  const items = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.15 },
  );

  items.forEach((item) => observer.observe(item));
}

// =========================
// COUNTDOWN
// =========================
const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

const eventDate = new Date("2026-03-21T20:00:00");

function updateCountdown() {
  const now = new Date().getTime();
  const distance = eventDate - now;

  if (distance <= 0) {
    days.textContent = "00";
    hours.textContent = "00";
    minutes.textContent = "00";
    seconds.textContent = "00";
    return;
  }

  const d = Math.floor(distance / (1000 * 60 * 60 * 24));
  const h = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const m = Math.floor((distance / (1000 * 60)) % 60);
  const s = Math.floor((distance / 1000) % 60);

  days.textContent = String(d).padStart(2, "0");
  hours.textContent = String(h).padStart(2, "0");
  minutes.textContent = String(m).padStart(2, "0");
  seconds.textContent = String(s).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();

// =========================
// HARRY VOLANDO POR TODA LA PANTALLA
// =========================
let harryVisible = true;
let harryPaused = false;
let flightTimer = null;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function moveHarryRandom() {
  if (!floatingHarry || harryPaused) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const size = randomBetween(80, 125);
  const x = randomBetween(10, Math.max(20, vw - size - 10));
  const y = randomBetween(80, Math.max(120, vh - size - 120));
  const rotate = randomBetween(-12, 12);
  const scale = randomBetween(0.92, 1.1);

  floatingHarry.style.width = `${size}px`;
  floatingHarry.style.left = `${x}px`;
  floatingHarry.style.top = `${y}px`;
  floatingHarry.style.transform = `rotate(${rotate}deg) scale(${scale})`;
  floatingHarry.style.opacity = harryVisible ? "0.92" : "0";

  harryVisible = !harryVisible;
}

function initHarryFlight() {
  if (!floatingHarry) return;

  floatingHarry.style.left = "20px";
  floatingHarry.style.top = "140px";
  floatingHarry.style.opacity = "0.92";

  moveHarryRandom();

  flightTimer = setInterval(() => {
    moveHarryRandom();
  }, 3200);
}

if (floatingHarry) {
  floatingHarry.addEventListener("click", () => {
    harryPaused = true;
    floatingHarry.style.opacity = "0";
    floatingHarry.style.pointerEvents = "none";

    if (flightTimer) clearInterval(flightTimer);
  });
}

// =========================
// CARRUSEL
// =========================
const galleryTrack = document.getElementById("galleryTrack");
const slides = document.querySelectorAll(".gallery__slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let current = 0;

function updateSlider() {
  if (!galleryTrack) return;
  galleryTrack.style.transform = `translateX(-${current * 100}%)`;
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    current = (current + 1) % slides.length;
    updateSlider();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    current = (current - 1 + slides.length) % slides.length;
    updateSlider();
  });
}

setInterval(() => {
  if (!slides.length) return;
  current = (current + 1) % slides.length;
  updateSlider();
}, 5000);
