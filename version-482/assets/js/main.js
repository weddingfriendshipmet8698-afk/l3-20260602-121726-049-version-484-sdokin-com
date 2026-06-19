(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector),
    );
  }

  function normalise(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function setupHeader() {
    var header = document.querySelector("[data-header]");
    var button = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");

    function syncHeader() {
      if (!header) {
        return;
      }
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    }

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });

    if (button && panel) {
      button.addEventListener("click", function () {
        panel.classList.toggle("is-open");
      });
    }
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = selectAll("[data-hero-slide]", hero);
    var dots = selectAll("[data-hero-dot]", hero);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle("is-active", position === index);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle("is-active", position === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupFiltering() {
    var searchInput = document.querySelector(".js-filter-search");
    var scope = document.querySelector(".js-search-scope");
    var empty = document.querySelector("[data-empty-state]");
    if (!searchInput || !scope) {
      return;
    }
    var cards = selectAll("[data-search]", scope);
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");
    if (query) {
      searchInput.value = query;
    }

    function filter() {
      var keyword = normalise(searchInput.value);
      var visible = 0;
      cards.forEach(function (card) {
        var matched =
          !keyword ||
          normalise(card.getAttribute("data-search")).indexOf(keyword) !== -1;
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    searchInput.addEventListener("input", filter);
    filter();
  }

  function setupImages() {
    selectAll("img").forEach(function (image) {
      image.addEventListener(
        "error",
        function () {
          image.classList.add("image-hidden");
        },
        { once: true },
      );
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupHeader();
    setupHero();
    setupFiltering();
    setupImages();
  });
})();
