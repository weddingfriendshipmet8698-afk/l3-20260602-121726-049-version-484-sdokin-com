(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }

  function setupNavigation() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) {
      return;
    }
    toggle.addEventListener('click', function () {
      links.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }
    function play() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(dotIndex);
        play();
      });
    });
    show(0);
    play();
  }

  function setupFilters() {
    var input = document.querySelector('[data-filter-input]');
    var typeSelect = document.querySelector('[data-filter-type]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var empty = document.querySelector('[data-empty]');
    if (!cards.length) {
      return;
    }
    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }
    function apply() {
      var keyword = normalize(input ? input.value : '');
      var type = normalize(typeSelect ? typeSelect.value : '');
      var year = normalize(yearSelect ? yearSelect.value : '');
      var count = 0;
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-region'));
        var cardType = normalize(card.getAttribute('data-type'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var matched = (!keyword || text.indexOf(keyword) !== -1) && (!type || cardType === type) && (!year || cardYear === year);
        card.style.display = matched ? '' : 'none';
        if (matched) {
          count += 1;
        }
      });
      if (empty) {
        empty.style.display = count ? 'none' : 'block';
      }
    }
    [input, typeSelect, yearSelect].forEach(function (element) {
      if (element) {
        element.addEventListener('input', apply);
        element.addEventListener('change', apply);
      }
    });
    apply();
  }

  function setupHeroSearch() {
    var form = document.querySelector('[data-hero-search]');
    if (!form) {
      return;
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input');
      var value = input ? input.value.trim() : '';
      if (value) {
        window.location.href = 'search.html?q=' + encodeURIComponent(value);
      } else {
        window.location.href = 'search.html';
      }
    });
  }

  function setupSearchQuery() {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    var input = document.querySelector('[data-filter-input]');
    if (q && input) {
      input.value = q;
      input.dispatchEvent(new Event('input'));
    }
  }

  function setupPlayers() {
    var boxes = Array.prototype.slice.call(document.querySelectorAll('.player-box'));
    boxes.forEach(function (box) {
      var video = box.querySelector('video');
      var button = box.querySelector('.player-start');
      if (!video || !button) {
        return;
      }
      var source = video.getAttribute('data-src');
      function bindSource() {
        if (box.getAttribute('data-ready') === 'yes') {
          return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          box.hlsPlayer = hls;
        } else {
          video.src = source;
        }
        box.setAttribute('data-ready', 'yes');
      }
      function start() {
        bindSource();
        box.classList.add('is-playing');
        video.controls = true;
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {});
        }
      }
      button.addEventListener('click', start);
      var overlay = box.querySelector('.player-overlay');
      if (overlay) {
        overlay.addEventListener('click', start);
      }
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });
    });
  }

  ready(function () {
    setupNavigation();
    setupHero();
    setupFilters();
    setupHeroSearch();
    setupSearchQuery();
    setupPlayers();
  });
})();
