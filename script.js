// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== SCROLL ANIMATIONS =====
const fadeUpElements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

fadeUpElements.forEach(el => observer.observe(el));

// ===== ACCORDION MÓDULOS =====
document.querySelectorAll('.module-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.module-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.module-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.module-header').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      header.setAttribute('aria-expanded', 'true');
    }
  });
});
// Abrir primeiro módulo por padrão
const firstModule = document.querySelector('.module-item');
if (firstModule) {
  firstModule.classList.add('open');
  firstModule.querySelector('.module-header').setAttribute('aria-expanded', 'true');
}

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // Fechar todos
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
    });
    // Abrir o clicado (toggle)
    if (!isOpen) {
      item.classList.add('open');
      header.setAttribute('aria-expanded', 'true');
    }
  });
});

// ===== TESTIMONIALS CAROUSEL =====
const track = document.getElementById('testimonialTrack');
const cards = track ? Array.from(track.querySelectorAll('.testimonial-card')) : [];
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (track && cards.length > 0) {
  let currentIndex = 0;
  const GAP = 24;

  const visibleCount = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;

  // Calcula a largura real em px com base no container visível do carousel
  function getCardWidth() {
    const carousel = track.closest('.testimonials-carousel');
    const containerWidth = carousel ? carousel.offsetWidth : track.offsetWidth;
    const vc = visibleCount();
    return Math.floor((containerWidth - (vc - 1) * GAP) / vc);
  }

  // Aplica width explícito em cada card para evitar o problema do % no flex pai
  function applyCardWidths() {
    const w = getCardWidth();
    cards.forEach(card => {
      card.style.minWidth = w + 'px';
      card.style.maxWidth = w + 'px';
    });
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const count = Math.ceil(cards.length / visibleCount());
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Depoimento ${i + 1} de ${count}`);
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
    // cardWidth recalculado do DOM após applyCardWidths
    const cardWidth = cards[0].offsetWidth + GAP;
    track.style.transform = `translateX(-${currentIndex * vc * cardWidth}px)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Init
  applyCardWidths();
  buildDots();
  goTo(0);

  window.addEventListener('resize', () => {
    currentIndex = 0;
    applyCardWidths();
    buildDots();
    goTo(0);
  });

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
  const slides = sliderTrack.querySelectorAll('picture');
  const dotsWrap = document.getElementById('aboutDots');
  let idx = 0;

  dotsWrap.innerHTML = '';
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'sdot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Foto ${i + 1} de ${slides.length}`);
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
      d.setAttribute('aria-label', `Resultado ${i + 1} de ${pages}`);
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

// ===== LIGHTBOX =====
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevLb = document.getElementById('lightboxPrev');
  const nextLb = document.getElementById('lightboxNext');

  if (!lightbox) return;

  // Coletar todas as imagens da galeria
  const triggers = Array.from(document.querySelectorAll('.gallery-lightbox-trigger'));
  let currentLbIdx = 0;

  function openLightbox(idx) {
    currentLbIdx = idx;
    const img = triggers[idx];
    // Preferir WebP via picture source se disponível
    const picture = img.closest('picture');
    const webpSrc = picture ? picture.querySelector('source[type="image/webp"]') : null;
    lightboxImg.src = webpSrc ? webpSrc.srcset : img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt;
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    triggers[currentLbIdx].focus();
  }

  function navigate(dir) {
    currentLbIdx = (currentLbIdx + dir + triggers.length) % triggers.length;
    openLightbox(currentLbIdx);
  }

  triggers.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(i));
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `Ampliar: ${img.alt}`);
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevLb.addEventListener('click', () => navigate(-1));
  nextLb.addEventListener('click', () => navigate(1));

  // Fechar com Escape ou clique no fundo
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.hasAttribute('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    }
  });
}
initLightbox();

// ===== SMOOTH SCROLL para links âncora =====
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

// ===== MOBILE CTA BAR — ocultar no topo da página =====
const mobileCta = document.getElementById('mobileCta');
if (mobileCta) {
  window.addEventListener('scroll', () => {
    mobileCta.style.transform = window.scrollY > 300 ? 'translateY(0)' : 'translateY(100%)';
  });
  mobileCta.style.transform = 'translateY(100%)';
  mobileCta.style.transition = 'transform 0.3s ease';
}
