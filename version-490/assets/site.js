(function() {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-button]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function() {
      nav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var slides = selectAll('[data-hero-slide]');
    var dots = selectAll('[data-hero-dot]');
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('is-current', i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('is-current', i === index);
      });
    }
    function start() {
      timer = window.setInterval(function() {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        if (timer) {
          window.clearInterval(timer);
        }
        show(i);
        start();
      });
    });
    show(0);
    start();
  }

  function setupFilters() {
    var input = document.querySelector('[data-filter-input]');
    var typeFilter = document.querySelector('[data-type-filter]');
    var cards = selectAll('[data-card]');
    if (!cards.length || (!input && !typeFilter)) {
      return;
    }
    function apply() {
      var q = input ? input.value.trim().toLowerCase() : '';
      var typeValue = typeFilter ? typeFilter.value : '';
      cards.forEach(function(card) {
        var text = [
          card.dataset.title || '',
          card.dataset.year || '',
          card.dataset.type || '',
          card.dataset.region || '',
          card.dataset.genre || '',
          card.textContent || ''
        ].join(' ').toLowerCase();
        var okText = !q || text.indexOf(q) !== -1;
        var okType = !typeValue || text.indexOf(typeValue.toLowerCase()) !== -1;
        card.classList.toggle('is-hidden', !(okText && okType));
      });
    }
    if (input) {
      input.addEventListener('input', apply);
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q) {
        input.value = q;
      }
    }
    if (typeFilter) {
      typeFilter.addEventListener('change', apply);
    }
    apply();
  }

  function initMoviePlayer(options) {
    var video = document.querySelector('[data-player]');
    var button = document.querySelector('[data-play-button]');
    if (!video || !options || !options.stream) {
      return;
    }
    var stream = options.stream;
    var prepared = false;
    var hls = null;
    function prepare() {
      if (prepared) {
        return;
      }
      prepared = true;
      if (options.poster) {
        video.setAttribute('poster', options.poster);
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
      video.addEventListener('error', function() {
        if (hls) {
          hls.destroy();
          hls = null;
        }
      }, { once: true });
    }
    function play() {
      prepare();
      if (button) {
        button.hidden = true;
      }
      video.controls = true;
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function() {
          if (button) {
            button.hidden = false;
          }
        });
      }
    }
    if (button) {
      button.addEventListener('click', play);
    }
    video.addEventListener('click', function() {
      if (video.paused) {
        play();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;

  document.addEventListener('DOMContentLoaded', function() {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
