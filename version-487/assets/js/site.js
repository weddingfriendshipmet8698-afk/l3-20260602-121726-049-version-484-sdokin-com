
(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        if (!slides.length) {
            return;
        }
        var index = 0;
        function show(nextIndex) {
            index = nextIndex % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });
        window.setInterval(function () {
            show(index + 1);
        }, 5000);
    }

    function setupPageFilter() {
        var forms = Array.prototype.slice.call(document.querySelectorAll('[data-page-filter]'));
        forms.forEach(function (form) {
            var scope = form.closest('main') || document;
            var input = form.querySelector('[data-filter-input]');
            var year = form.querySelector('[data-filter-year]');
            var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-list] [data-movie-card]'));
            function applyFilter() {
                var query = (input && input.value || '').trim().toLowerCase();
                var selectedYear = year && year.value || '';
                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute('data-title'),
                        card.getAttribute('data-region'),
                        card.getAttribute('data-type'),
                        card.getAttribute('data-genre'),
                        card.getAttribute('data-category')
                    ].join(' ').toLowerCase();
                    var matchQuery = !query || haystack.indexOf(query) !== -1;
                    var matchYear = !selectedYear || card.getAttribute('data-year') === selectedYear;
                    card.classList.toggle('hidden-by-filter', !(matchQuery && matchYear));
                });
            }
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                applyFilter();
            });
            if (input) {
                input.addEventListener('input', applyFilter);
            }
            if (year) {
                year.addEventListener('change', applyFilter);
            }
        });
    }

    function setupGlobalSearch() {
        var form = document.querySelector('[data-global-search]');
        var results = document.querySelector('[data-search-results]');
        var count = document.querySelector('[data-search-count]');
        if (!form || !results || !window.MOVIE_INDEX) {
            return;
        }
        var queryInput = form.querySelector('[data-global-query]');
        var yearSelect = form.querySelector('[data-global-year]');

        function cardTemplate(movie) {
            return [
                '<article class="movie-card">',
                '    <a href="' + movie.href + '" class="poster-link">',
                '        <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" onerror="this.classList.add(\'image-missing\')">',
                '        <span class="play-hover">播放</span>',
                '    </a>',
                '    <div class="movie-card-body">',
                '        <div class="card-meta-row">',
                '            <span>' + escapeHtml(movie.region) + '</span>',
                '            <span>' + escapeHtml(movie.type) + '</span>',
                '            <span>' + escapeHtml(String(movie.year || '')) + '</span>',
                '        </div>',
                '        <h3><a href="' + movie.href + '">' + escapeHtml(movie.title) + '</a></h3>',
                '        <p>' + escapeHtml(movie.desc) + '</p>',
                '        <div class="genre-line">' + escapeHtml(movie.genre) + '</div>',
                '    </div>',
                '</article>'
            ].join('\n');
        }

        function escapeHtml(value) {
            return String(value || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function render() {
            var query = (queryInput.value || '').trim().toLowerCase();
            var year = yearSelect.value || '';
            var matched = window.MOVIE_INDEX.filter(function (movie) {
                var haystack = [movie.title, movie.region, movie.type, movie.genre, movie.category, movie.desc].join(' ').toLowerCase();
                var matchQuery = !query || haystack.indexOf(query) !== -1;
                var matchYear = !year || String(movie.year) === year;
                return matchQuery && matchYear;
            }).slice(0, 120);
            results.innerHTML = matched.map(cardTemplate).join('\n');
            if (count) {
                count.textContent = '当前显示 ' + matched.length + ' 条结果';
            }
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            render();
        });
        queryInput.addEventListener('input', render);
        yearSelect.addEventListener('change', render);

        var params = new URLSearchParams(window.location.search);
        if (params.get('q')) {
            queryInput.value = params.get('q');
        }
        render();
    }

    function setupPlayer() {
        var button = document.querySelector('[data-player-start]');
        var video = document.getElementById('main-player');
        if (!button || !video) {
            return;
        }
        function start() {
            var src = video.getAttribute('data-src');
            var fallback = video.getAttribute('data-fallback');
            button.classList.add('is-hidden');
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls();
                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
            } else {
                video.src = fallback;
            }
            video.play().catch(function () {});
        }
        button.addEventListener('click', start);
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupPageFilter();
        setupGlobalSearch();
        setupPlayer();
    });
})();
