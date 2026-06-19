(function () {
    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function createCard(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");

        return "" +
            "<article class=\"movie-card\">" +
                "<a class=\"poster-link\" href=\"" + escapeHtml(movie.url) + "\">" +
                    "<img src=\"" + escapeHtml(movie.image) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">" +
                    "<span class=\"poster-shade\"></span>" +
                    "<span class=\"play-chip\">播放</span>" +
                "</a>" +
                "<div class=\"card-body\">" +
                    "<div class=\"meta-row\"><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.year) + "</span></div>" +
                    "<h3><a href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3>" +
                    "<p>" + escapeHtml(movie.oneLine || "") + "</p>" +
                    "<div class=\"tag-row\">" + tags + "</div>" +
                "</div>" +
            "</article>";
    }

    function includesText(movie, keyword) {
        if (!keyword) {
            return true;
        }

        var haystack = [
            movie.title,
            movie.region,
            movie.type,
            movie.year,
            movie.genre,
            movie.oneLine,
            (movie.tags || []).join(" ")
        ].join(" ").toLowerCase();

        return haystack.indexOf(keyword.toLowerCase()) !== -1;
    }

    function setupSearch() {
        var root = document.querySelector("[data-search-app]");
        var data = window.MOVIE_SEARCH_DATA || [];

        if (!root || !data.length) {
            return;
        }

        var form = root.querySelector("[data-search-form]");
        var input = root.querySelector("[data-search-input]");
        var region = root.querySelector("[data-region-filter]");
        var type = root.querySelector("[data-type-filter]");
        var genre = root.querySelector("[data-genre-filter]");
        var status = root.querySelector("[data-search-status]");
        var results = root.querySelector("[data-search-results]");
        var reset = root.querySelector("[data-reset-search]");

        function getMatches() {
            var keyword = input.value.trim();
            var regionValue = region.value;
            var typeValue = type.value;
            var genreValue = genre.value;

            return data.filter(function (movie) {
                var matchesRegion = !regionValue || movie.region === regionValue;
                var matchesType = !typeValue || movie.type === typeValue;
                var matchesGenre = !genreValue || String(movie.genre || "").indexOf(genreValue) !== -1;
                return matchesRegion && matchesType && matchesGenre && includesText(movie, keyword);
            });
        }

        function render() {
            var matches = getMatches().slice(0, 60);

            if (!matches.length) {
                results.innerHTML = "";
                status.textContent = "没有找到匹配内容，请尝试更换关键词或筛选条件。";
                return;
            }

            results.innerHTML = matches.map(createCard).join("");
            status.textContent = "已显示匹配影片，可继续调整条件缩小范围。";
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            render();
        });

        [input, region, type, genre].forEach(function (field) {
            field.addEventListener("input", render);
            field.addEventListener("change", render);
        });

        reset.addEventListener("click", function () {
            input.value = "";
            region.value = "";
            type.value = "";
            genre.value = "";
            render();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupSearch);
    } else {
        setupSearch();
    }
})();
