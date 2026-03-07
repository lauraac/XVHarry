const intro = document.getElementById("intro");
const introVideo = document.getElementById("introVideo");
const skipIntro = document.getElementById("skipIntro");
const tapToSound = document.getElementById("tapToSound");
const site = document.getElementById("site");
const floatingHarry = document.getElementById("floatingHarry");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

// =========================
// INTRO VIDEO
// =========================
let soundEnabled = false;
let introDone = false;
let musicStarted = false;

function startBackgroundMusic() {
  if (!bgMusic || musicStarted) return;

  bgMusic.currentTime = 0;
  bgMusic.volume = 0.7;

  bgMusic
    .play()
    .then(() => {
      musicStarted = true;

      if (musicToggle) {
        musicToggle.classList.remove("hidden");
        musicToggle.textContent = "❚❚";
        musicToggle.setAttribute("aria-label", "Pausar música");
      }
    })
    .catch(() => {
      if (musicToggle) {
        musicToggle.classList.remove("hidden");
        musicToggle.textContent = "▶";
        musicToggle.setAttribute("aria-label", "Reproducir música");
      }
    });
}

function stopIntroVideoAudio() {
  if (!introVideo) return;

  introVideo.pause();
  introVideo.muted = true;
  introVideo.currentTime = introVideo.currentTime || 0;
}

function showSite() {
  if (introDone) return;
  introDone = true;

  stopIntroVideoAudio();

  intro.style.opacity = "0";
  intro.style.pointerEvents = "none";

  setTimeout(() => {
    intro.style.display = "none";
    site.classList.remove("hidden");
    window.scrollTo(0, 0);
    initReveal();
    initHarryFlight();
    startBackgroundMusic();
  }, 700);
}
async function enableSoundOnce(e) {
  if (soundEnabled || !introVideo) return;

  // evita que tocar "Saltar" active también el sonido
  if (e && (e.target === skipIntro || skipIntro?.contains(e.target))) return;

  soundEnabled = true;

  try {
    const currentTime = introVideo.currentTime || 0;

    introVideo.muted = false;
    introVideo.volume = 1;

    await introVideo.play();

    // respaldo para Android si se pausa al quitar mute
    setTimeout(() => {
      if (!introDone && introVideo.paused) {
        introVideo.currentTime = currentTime;

        introVideo.play().catch(() => {
          setTimeout(() => {
            if (!introDone && introVideo.paused) {
              introVideo.play().catch(() => {});
            }
          }, 180);
        });
      }
    }, 120);
  } catch (error) {
    console.log("No se pudo activar el audio:", error);
  }

  if (tapToSound) tapToSound.style.display = "none";
}

if (introVideo) {
  introVideo.muted = true;
  introVideo.setAttribute("muted", "");
  introVideo.setAttribute("playsinline", "");
  introVideo.setAttribute("webkit-playsinline", "");

  introVideo.play().catch(() => {
    console.log("Autoplay bloqueado");
  });

  introVideo.addEventListener("ended", showSite);

  introVideo.addEventListener("error", () => {
    console.log("Error al cargar video");
    showSite();
  });
}

if (skipIntro) {
  skipIntro.addEventListener("click", (e) => {
    e.stopPropagation();
    showSite();
  });
}
if (intro) {
  intro.addEventListener("click", enableSoundOnce);
}
if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic
        .play()
        .then(() => {
          musicToggle.textContent = "❚❚";
          musicToggle.setAttribute("aria-label", "Pausar música");
        })
        .catch(() => {});
    } else {
      bgMusic.pause();
      musicToggle.textContent = "▶";
      musicToggle.setAttribute("aria-label", "Reproducir música");
    }
  });
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

const eventDate = new Date("2026-03-07T20:00:00");

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

// =========================
// MENSAJES DEL EVENTO
// =========================
const guestbookForm = document.getElementById("guestbookForm");
const guestName = document.getElementById("guestName");
const guestMessage = document.getElementById("guestMessage");
const guestbookStatus = document.getElementById("guestbookStatus");
const messagesBoard = document.getElementById("messagesBoard");
const photoShareButton = document.getElementById("photoShareButton");

// Cambia este valor cuando conectes Drive:
const PHOTO_SHARE_URL = "#";

// Si ya tienes enlace real de Drive, se coloca aquí automáticamente
if (photoShareButton && PHOTO_SHARE_URL !== "#") {
  photoShareButton.href = PHOTO_SHARE_URL;
}

if (photoShareButton && PHOTO_SHARE_URL === "#") {
  photoShareButton.addEventListener("click", (e) => {
    e.preventDefault();
    alert(
      "Aquí irá el enlace para compartir fotos cuando lo conectemos con Drive.",
    );
  });
}

function getSavedMessages() {
  try {
    return JSON.parse(localStorage.getItem("xv_guest_messages")) || [];
  } catch (error) {
    return [];
  }
}

function saveMessages(messages) {
  localStorage.setItem("xv_guest_messages", JSON.stringify(messages));
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderMessages() {
  if (!messagesBoard) return;

  const messages = getSavedMessages();

  if (!messages.length) {
    messagesBoard.innerHTML = `
      <div class="message-card message-card--empty">
        <p>Aún no hay mensajes. Sé la primera persona en dejar unas palabras bonitas ✨</p>
      </div>
    `;
    return;
  }

  messagesBoard.innerHTML = messages
    .slice()
    .reverse()
    .map((item) => {
      return `
        <article class="message-card">
          <h4>${escapeHTML(item.name)}</h4>
          <p>${escapeHTML(item.message)}</p>
        </article>
      `;
    })
    .join("");
}

if (guestbookForm) {
  guestbookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = guestName.value.trim();
    const message = guestMessage.value.trim();

    if (!name || !message) {
      if (guestbookStatus) {
        guestbookStatus.textContent =
          "Por favor completa tu nombre y tu mensaje.";
      }
      return;
    }

    const messages = getSavedMessages();
    messages.push({
      name,
      message,
      createdAt: new Date().toISOString(),
    });

    saveMessages(messages);
    renderMessages();

    guestbookForm.reset();

    if (guestbookStatus) {
      guestbookStatus.textContent = "Tu mensaje se guardó correctamente ✨";
    }

    setTimeout(() => {
      if (guestbookStatus) {
        guestbookStatus.textContent = "";
      }
    }, 3000);
  });
}

renderMessages();
