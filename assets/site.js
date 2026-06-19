(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-nav-links]');

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.carousel-dot'));
    var prev = document.querySelector('[data-carousel-prev]');
    var next = document.querySelector('[data-carousel-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === current);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === current);
        });
    }

    function restartCarousel() {
        if (timer) {
            window.clearInterval(timer);
        }

        if (slides.length > 1) {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5600);
        }
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
            restartCarousel();
        });
    });

    if (prev) {
        prev.addEventListener('click', function () {
            showSlide(current - 1);
            restartCarousel();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            showSlide(current + 1);
            restartCarousel();
        });
    }

    showSlide(0);
    restartCarousel();

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    var keywordInput = document.querySelector('[data-filter-keyword]');
    var typeSelect = document.querySelector('[data-filter-type]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

    if (keywordInput && q) {
        keywordInput.value = q;
    }

    function applyFilters() {
        var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
        var type = typeSelect ? typeSelect.value : '';
        var year = yearSelect ? yearSelect.value : '';

        cards.forEach(function (card) {
            var text = (card.getAttribute('data-search') || '').toLowerCase();
            var cardType = card.getAttribute('data-type') || '';
            var cardYear = card.getAttribute('data-year') || '';
            var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchType = !type || cardType.indexOf(type) !== -1;
            var matchYear = !year || cardYear === year;
            card.hidden = !(matchKeyword && matchType && matchYear);
        });
    }

    if (keywordInput || typeSelect || yearSelect) {
        ['input', 'change'].forEach(function (eventName) {
            if (keywordInput) {
                keywordInput.addEventListener(eventName, applyFilters);
            }
            if (typeSelect) {
                typeSelect.addEventListener(eventName, applyFilters);
            }
            if (yearSelect) {
                yearSelect.addEventListener(eventName, applyFilters);
            }
        });
        applyFilters();
    }
})();
