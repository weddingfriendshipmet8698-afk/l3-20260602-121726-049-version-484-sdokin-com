const Hls = window.Hls;

const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = document.querySelector('[data-nav-links]');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('is-open');
  });
}

const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
let slideIndex = 0;

function showSlide(nextIndex) {
  if (!slides.length) return;
  slides[slideIndex].classList.remove('is-active');
  slideIndex = (nextIndex + slides.length) % slides.length;
  slides[slideIndex].classList.add('is-active');
}

const nextHero = document.querySelector('[data-hero-next]');
const prevHero = document.querySelector('[data-hero-prev]');

if (slides.length) {
  nextHero?.addEventListener('click', () => showSlide(slideIndex + 1));
  prevHero?.addEventListener('click', () => showSlide(slideIndex - 1));
  window.setInterval(() => showSlide(slideIndex + 1), 5200);
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

const searchForm = document.querySelector('[data-search-form]');
const searchInput = document.querySelector('[data-search-input]');
const regionFilter = document.querySelector('[data-region-filter]');
const typeFilter = document.querySelector('[data-type-filter]');
const yearFilter = document.querySelector('[data-year-filter]');
const resultCount = document.querySelector('[data-result-count]');
const searchCards = Array.from(document.querySelectorAll('[data-title]'));

function applySearch() {
  if (!searchCards.length) return;
  const query = normalizeText(searchInput?.value);
  const region = normalizeText(regionFilter?.value);
  const type = normalizeText(typeFilter?.value);
  const year = normalizeText(yearFilter?.value);
  let visible = 0;

  searchCards.forEach((card) => {
    const haystack = normalizeText([
      card.dataset.title,
      card.dataset.region,
      card.dataset.type,
      card.dataset.year,
      card.dataset.tags
    ].join(' '));
    const matchedQuery = !query || haystack.includes(query);
    const matchedRegion = !region || normalizeText(card.dataset.region).includes(region);
    const matchedType = !type || normalizeText(card.dataset.type).includes(type);
    const matchedYear = !year || normalizeText(card.dataset.year) === year;
    const matched = matchedQuery && matchedRegion && matchedType && matchedYear;
    card.style.display = matched ? '' : 'none';
    if (matched) visible += 1;
  });

  if (resultCount) {
    resultCount.textContent = String(visible);
  }
}

if (searchForm) {
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q');
  if (initialQuery && searchInput) {
    searchInput.value = initialQuery;
  }
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    applySearch();
  });
  [searchInput, regionFilter, typeFilter, yearFilter].forEach((item) => {
    item?.addEventListener('input', applySearch);
    item?.addEventListener('change', applySearch);
  });
  applySearch();
}

function setupVideo(video) {
  const source = video.dataset.m3u8;
  if (!source) return;

  if (Hls && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false
    });
    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (!data.fatal) return;
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hls.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
      } else {
        hls.destroy();
      }
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
  }

  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
}

Array.from(document.querySelectorAll('video[data-m3u8]')).forEach(setupVideo);
