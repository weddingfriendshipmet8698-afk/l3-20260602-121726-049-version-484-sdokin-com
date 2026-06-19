(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var active = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === active);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === active);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  var filterForms = Array.prototype.slice.call(document.querySelectorAll('.filter-box'));
  filterForms.forEach(function (box) {
    var input = box.querySelector('[data-filter-input]');
    var region = box.querySelector('[data-filter-region]');
    var year = box.querySelector('[data-filter-year]');
    var target = box.getAttribute('data-target');
    var cards = Array.prototype.slice.call(document.querySelectorAll(target || '.movie-card'));

    function applyFilter() {
      var q = input ? input.value.trim().toLowerCase() : '';
      var r = region ? region.value : '';
      var y = year ? year.value : '';
      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-tags') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-type') || ''
        ].join(' ').toLowerCase();
        var okQ = !q || text.indexOf(q) > -1;
        var okR = !r || (card.getAttribute('data-region') || '') === r;
        var okY = !y || String(card.getAttribute('data-year') || '') === y;
        card.classList.toggle('hidden-card', !(okQ && okR && okY));
      });
    }

    [input, region, year].forEach(function (node) {
      if (node) {
        node.addEventListener('input', applyFilter);
        node.addEventListener('change', applyFilter);
      }
    });
  });
})();
