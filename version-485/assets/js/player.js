(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function playVideo(video) {
        var attempt = video.play();

        if (attempt && typeof attempt.catch === "function") {
            attempt.catch(function () {
                video.controls = true;
            });
        }
    }

    function setupPlayer(root) {
        var video = root.querySelector("video");
        var button = root.querySelector("[data-play-button]");
        var source = root.getAttribute("data-source");
        var loaded = false;
        var hlsInstance = null;

        if (!video || !button || !source) {
            return;
        }

        function hideButton() {
            button.classList.add("is-hidden");
        }

        function loadSource() {
            if (loaded) {
                playVideo(video);
                hideButton();
                return;
            }

            loaded = true;
            video.controls = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                video.addEventListener("loadedmetadata", function () {
                    playVideo(video);
                }, { once: true });
                hideButton();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    playVideo(video);
                });
                hideButton();
                return;
            }

            video.src = source;
            playVideo(video);
            hideButton();
        }

        button.addEventListener("click", loadSource);
        video.addEventListener("click", function () {
            if (!loaded) {
                loadSource();
            }
        });
        video.addEventListener("play", hideButton);
        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    ready(function () {
        Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(setupPlayer);
    });
})();
