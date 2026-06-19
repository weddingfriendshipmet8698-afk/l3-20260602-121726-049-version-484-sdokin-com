(function () {
  var boxes = Array.prototype.slice.call(document.querySelectorAll('.player-box'));

  boxes.forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.play-layer');
    var first = video ? video.querySelector('source') : null;
    var url = first ? first.getAttribute('src') : '';

    function start() {
      if (!video || !url) {
        return;
      }

      if (!video.getAttribute('data-ready')) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          video._hls = hls;
        } else {
          video.src = url;
        }
        video.setAttribute('data-ready', '1');
      }

      video.setAttribute('controls', 'controls');
      box.classList.add('is-playing');
      if (button) {
        button.setAttribute('hidden', 'hidden');
      }
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', start);
    }
    if (video) {
      video.addEventListener('click', start, { once: true });
    }
  });
})();
