// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== FLOATING HEARTS GENERATOR =====
const heartsContainer = document.getElementById('floating-hearts');
const heartSymbols = ['❤️','💕','💗','💖','💝','🌸','✨'];
let heartInterval = null;

function spawnHeart() {
  const h = document.createElement('div');
  h.classList.add('floating-heart');
  h.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
  const dur = 5 + Math.random() * 5;
  h.style.animationDuration = dur + 's';
  heartsContainer.appendChild(h);
  setTimeout(() => h.remove(), dur * 1000);
}

function startHearts(burst = false) {
  if (burst) {
    for (let i = 0; i < 30; i++) setTimeout(spawnHeart, i * 60);
  }
  if (!heartInterval) {
    heartInterval = setInterval(spawnHeart, 900);
  }
}

// Subtle hearts always on
startHearts(false);

// ===== STAR CANVAS =====
function generateStars() {
  const layer = document.getElementById('stars-layer');
  if (!layer) return;
  let gradients = '';
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = (0.5 + Math.random() * 1.5).toFixed(1);
    const colors = ['rgba(255,255,255,0.8)', 'rgba(244,114,182,0.6)', 'rgba(251,191,36,0.7)', 'rgba(192,132,252,0.6)'];
    const c = colors[Math.floor(Math.random() * colors.length)];
    gradients += `radial-gradient(${size}px ${size}px at ${x}% ${y}%, ${c} 0%, transparent 100%),`;
  }
  layer.style.backgroundImage = gradients.slice(0, -1);
}
generateStars();

// ===== MUSIC TOGGLE =====
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
let musicPlaying = false;

musicBtn.addEventListener('click', () => {
  if (musicPlaying) {
    bgMusic.pause();
    musicBtn.classList.remove('playing');
    musicBtn.querySelector('.music-icon').textContent = '🎵';
    musicBtn.querySelector('.music-label').textContent = 'Music';
  } else {
    bgMusic.play().catch(() => {});
    musicBtn.classList.add('playing');
    musicBtn.querySelector('.music-icon').textContent = '🎶';
    musicBtn.querySelector('.music-label').textContent = 'Playing';
  }
  musicPlaying = !musicPlaying;
});

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxBackdrop = document.getElementById('lightbox-backdrop');

let currentIndex = 0;

const galleryData = Array.from(galleryItems).map(item => ({
  src: item.querySelector('.gallery-img').src,
  caption: item.querySelector('.gallery-caption').textContent
}));

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = galleryData[index].src;
  lightboxCaption.textContent = galleryData[index].caption;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  currentIndex = (currentIndex + dir + galleryData.length) % galleryData.length;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = galleryData[currentIndex].src;
    lightboxCaption.textContent = galleryData[currentIndex].caption;
    lightboxImg.style.opacity = '1';
  }, 200);
}

galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));
lightboxImg.style.transition = 'opacity 0.2s';

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('revealed'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .timeline-item, .reason-card').forEach(el => {
  revealObserver.observe(el);
});

// ===== LOVE LETTER TYPING ANIMATION =====
const letterLines = [
  "Riya,",
  "",
  "Nineteen months. I can't quite believe it.",
  "",
  "I still remember the first time I realized you weren't just someone I liked — you were",
  "someone I needed. Not in a desperate way, but in the quiet, certain way you need the",
  "sun to rise. You had become part of how I understood my days.",
  "",
  "You have this way of making everything feel a little lighter. Whether it's the way you",
  "laugh at your own jokes before you finish telling them, or how you remember the small",
  "things I mention in passing — you pay attention in ways that make me feel seen.",
  "Truly, deeply seen.",
  "",
  "Every 5th of every month, I get to stop and say: I choose this. I choose you.",
  "Not out of habit. Not out of obligation. But because loving you is the easiest,",
  "most natural thing I have ever done.",
  "",
  "Nineteen months in, and I still get butterflies. I still catch myself smiling at",
  "nothing — and realizing it's because of you. That doesn't go away with you.",
  "If anything, it only grows.",
  "",
  "Thank you for being my calm, my laughter, my home.",
  "Here's to every 5th that follows — each one more beautiful than the last.",
  "",
  "All my love, always,"
];

const letterTextEl = document.getElementById('letter-text');
const letterCursor = document.getElementById('letter-cursor');
let charIndex = 0, lineIndex = 0;
let fullText = letterLines.join('\n');
let rendered = '';
let typingStarted = false;

function typeNextChar() {
  if (charIndex < fullText.length) {
    rendered += fullText[charIndex] === '\n' ? '<br/>' : fullText[charIndex];
    letterTextEl.innerHTML = rendered;
    charIndex++;
    const speed = fullText[charIndex - 1] === '\n' ? 60 : (Math.random() < 0.1 ? 80 : 25);
    setTimeout(typeNextChar, speed);
  } else {
    letterCursor.style.display = 'none';
  }
}

const letterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !typingStarted) {
      typingStarted = true;
      setTimeout(typeNextChar, 600);
      letterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const letterSection = document.getElementById('letter');
if (letterSection) letterObserver.observe(letterSection);

// ===== SURPRISE BUTTON =====
const surpriseBtn = document.getElementById('surprise-btn');
const surpriseMsg = document.getElementById('surprise-message');
let surpriseRevealed = false;

surpriseBtn.addEventListener('click', () => {
  if (!surpriseRevealed) {
    surpriseMsg.classList.add('revealed');
    surpriseBtn.querySelector('.btn-text').textContent = '💛 Feeling the Love';
    surpriseBtn.disabled = true;
    surpriseBtn.style.opacity = '0.7';
    surpriseRevealed = true;
    // Burst of hearts
    for (let i = 0; i < 40; i++) {
      setTimeout(spawnHeart, i * 50);
    }
  }
});

// ===== SMOOTH ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--pink)' : '';
  });
});
