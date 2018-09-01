! function() {

    // debounced scroll event

    function _scroll(a, b) {
        return window.addEventListener("scroll", function() {
            clearTimeout(b);
            b = setTimeout(a, 200);
        }), a;
    }

    // main function wrapper

    function lazyestload() {

        // all the images with class lazyestload

        var images = document.querySelectorAll("img.lazyestload");
        var i = images.length;

        // loop de loop

        while (i--) {
            var wH = window.innerHeight;
            var boundingRect = images[i].getBoundingClientRect();
            var offset = 100;
            var yPositionTop = boundingRect.top - wH;
            var yPositionBottom = boundingRect.bottom;

            // if the top of the image is within 100px from the bottom of the viewport
            // and if the bottom of the image is within 100px from the top of the viewport
            // basically if the image is in the viewport, with a bit of buffer

            if (yPositionTop <= offset && yPositionBottom >= -offset) {

                // replace the src with the data-src      

                if (images[i].getAttribute("data-src")) {
                    images[i].src = images[i].getAttribute("data-src");
                }

                // replace the srcset with the data-srcset  

                if (images[i].getAttribute("data-srcset")) {
                    images[i].srcset = images[i].getAttribute("data-srcset");
                }

                // replace the source srcset's with the data-srcset's

                if (images[i].parentElement.tagName === "PICTURE") {
                    var sources = images[i].parentElement.querySelectorAll("source");
                    var j = sources.length;
                    while (j--) {
                        sources[j].srcset = sources[j].getAttribute("data-srcset");
                    }
                }

                // wait until the new image is loaded

                images[i].addEventListener('load', function() {
                    this.classList.remove("lazyestload");
                });

            }
        }
    }

    // run on debounced scroll event and once on load

    _scroll(function() {
        lazyestload();
    })();
}();