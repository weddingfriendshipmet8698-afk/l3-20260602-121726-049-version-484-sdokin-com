(function () {
  function prepare(video, source) {
    if (video.dataset.ready === '1') {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(source);
      hls.attachMedia(video);
      video.hls = hls;
    } else {
      video.src = source;
    }
    video.dataset.ready = '1';
  }

  function start(shell) {
    var video = shell.querySelector('video');
    var overlay = shell.querySelector('[data-play]');
    if (!video) {
      return;
    }
    var source = video.getAttribute('data-src');
    if (!source) {
      return;
    }
    prepare(video, source);
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
    var action = video.play();
    if (action && typeof action.catch === 'function') {
      action.catch(function () {});
    }
  }

  document.querySelectorAll('[data-player]').forEach(function (shell) {
    var video = shell.querySelector('video');
    var overlay = shell.querySelector('[data-play]');
    if (overlay) {
      overlay.addEventListener('click', function () {
        start(shell);
      });
    }
    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start(shell);
        }
      });
      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });
    }
  });
}());
