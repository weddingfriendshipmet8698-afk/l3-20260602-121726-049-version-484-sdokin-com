(function () {
  var input = document.querySelector('[data-search-input]');
  var region = document.querySelector('[data-search-region]');
  var genre = document.querySelector('[data-search-genre]');
  var type = document.querySelector('[data-search-type]');
  var results = document.querySelector('[data-search-results]');
  if (!input || !results || !window.MOVIE_SEARCH_DATA) {
    return;
  }

  function uniqueValues(key) {
    var seen = {};
    return window.MOVIE_SEARCH_DATA.map(function (item) {
      return item[key] || '';
    }).filter(function (value) {
      if (!value || seen[value]) {
        return false;
      }
      seen[value] = true;
      return true;
    }).slice(0, 80);
  }

  function fillSelect(select, values) {
    if (!select) {
      return;
    }
    values.forEach(function (value) {
      var option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  fillSelect(region, uniqueValues('region'));
  fillSelect(genre, uniqueValues('genre'));
  fillSelect(type, uniqueValues('type'));

  var params = new URLSearchParams(window.location.search);
  var initial = params.get('q') || '';
  input.value = initial;

  function card(item) {
    return [
      '<a class="movie-card" href="' + item.url + '">',
      '<span class="movie-thumb"><img src="' + item.image + '" alt="' + escapeHtml(item.title) + '"><span class="play-badge">HD</span></span>',
      '<span class="card-body">',
      '<h3>' + escapeHtml(item.title) + '</h3>',
      '<p>' + escapeHtml(item.one_line) + '</p>',
      '<span class="meta-row"><span class="pill">' + escapeHtml(item.year) + '</span><span class="pill">' + escapeHtml(item.region) + '</span></span>',
      '</span>',
      '</a>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function render() {
    var keyword = input.value.trim().toLowerCase();
    var regionValue = region ? region.value : '';
    var genreValue = genre ? genre.value : '';
    var typeValue = type ? type.value : '';
    var filtered = window.MOVIE_SEARCH_DATA.filter(function (item) {
      var text = [item.title, item.region, item.type, item.genre, item.one_line, (item.tags || []).join(' ')].join(' ').toLowerCase();
      return (!keyword || text.indexOf(keyword) !== -1)
        && (!regionValue || item.region === regionValue)
        && (!genreValue || item.genre === genreValue)
        && (!typeValue || item.type === typeValue);
    }).slice(0, 80);
    results.innerHTML = filtered.map(card).join('');
  }

  [input, region, genre, type].forEach(function (field) {
    if (field) {
      field.addEventListener('input', render);
      field.addEventListener('change', render);
    }
  });

  render();
}());
