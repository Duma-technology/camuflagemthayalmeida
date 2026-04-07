// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== SCROLL ANIMATIONS =====
const fadeUpElements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeUpElements.forEach(el => observer.observe(el));

// ===== ACCORDION =====
document.querySelectorAll('.module-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.module-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.module-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
// Open first module by default
const firstModule = document.querySelector('.module-item');
if (firstModule) firstModule.classList.add('open');

// ===== TESTIMONIALS CAROUSEL =====
const track = document.getElementById('testimonialTrack');
const cards = track ? track.querySelectorAll('.testimonial-card') : [];
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (track && cards.length > 0) {
  let currentIndex = 0;
  const visibleCount = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;

  // Create dots
  function buildDots() {
    dotsContainer.innerHTML = '';
    const count = Math.ceil(cards.length / visibleCount());
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  function goTo(index) {
    const vc = visibleCount();
    const max = Math.ceil(cards.length / vc) - 1;
    currentIndex = Math.max(0, Math.min(index, max));
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${currentIndex * vc * cardWidth}px)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  buildDots();
  window.addEventListener('resize', () => {
    currentIndex = 0;
    buildDots();
    goTo(0);
  });

  // Auto-play
  let autoplay = setInterval(() => {
    const max = Math.ceil(cards.length / visibleCount()) - 1;
    goTo(currentIndex >= max ? 0 : currentIndex + 1);
  }, 5000);

  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => {
      const max = Math.ceil(cards.length / visibleCount()) - 1;
      goTo(currentIndex >= max ? 0 : currentIndex + 1);
    }, 5000);
  });
}

// ===== ABOUT SLIDER =====
function initAboutSlider() {
  const sliderTrack = document.getElementById('aboutSliderTrack');
  if (!sliderTrack) return;
  const slides = sliderTrack.querySelectorAll('img');
  const dotsWrap = document.getElementById('aboutDots');
  let idx = 0;

  dotsWrap.innerHTML = '';
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'sdot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goAbout(i));
    dotsWrap.appendChild(d);
  });

  function goAbout(i) {
    idx = (i + slides.length) % slides.length;
    sliderTrack.style.transform = `translateX(-${idx * 100}%)`;
    dotsWrap.querySelectorAll('.sdot').forEach((d, j) => d.classList.toggle('active', j === idx));
  }

  document.getElementById('aboutPrev').addEventListener('click', () => goAbout(idx - 1));
  document.getElementById('aboutNext').addEventListener('click', () => goAbout(idx + 1));

  let auto = setInterval(() => goAbout(idx + 1), 4000);
  sliderTrack.addEventListener('mouseenter', () => clearInterval(auto));
  sliderTrack.addEventListener('mouseleave', () => { auto = setInterval(() => goAbout(idx + 1), 4000); });
}
initAboutSlider();

// ===== GALLERY SLIDER =====
function initGallerySlider() {
  const gTrack = document.getElementById('galleryTrack');
  if (!gTrack) return;
  const gSlides = gTrack.querySelectorAll('.gallery-slide');
  const gDotsWrap = document.getElementById('galleryDots');
  let gIdx = 0;

  const gVisible = () => window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;

  function buildGDots() {
    gDotsWrap.innerHTML = '';
    const pages = Math.ceil(gSlides.length / gVisible());
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('button');
      d.className = 'gdot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goGallery(i));
      gDotsWrap.appendChild(d);
    }
  }

  function goGallery(i) {
    const vc = gVisible();
    const max = Math.ceil(gSlides.length / vc) - 1;
    gIdx = Math.max(0, Math.min(i, max));
    const w = gSlides[0].offsetWidth + 20;
    gTrack.style.transform = `translateX(-${gIdx * vc * w}px)`;
    gDotsWrap.querySelectorAll('.gdot').forEach((d, j) => d.classList.toggle('active', j === gIdx));
  }

  document.getElementById('galleryPrev').addEventListener('click', () => goGallery(gIdx - 1));
  document.getElementById('galleryNext').addEventListener('click', () => goGallery(gIdx + 1));

  buildGDots();
  window.addEventListener('resize', () => { gIdx = 0; buildGDots(); goGallery(0); });

  let gAuto = setInterval(() => {
    const max = Math.ceil(gSlides.length / gVisible()) - 1;
    goGallery(gIdx >= max ? 0 : gIdx + 1);
  }, 3500);
  gTrack.addEventListener('mouseenter', () => clearInterval(gAuto));
  gTrack.addEventListener('mouseleave', () => {
    gAuto = setInterval(() => {
      const max = Math.ceil(gSlides.length / gVisible()) - 1;
      goGallery(gIdx >= max ? 0 : gIdx + 1);
    }, 3500);
  });
}
initGallerySlider();

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});
