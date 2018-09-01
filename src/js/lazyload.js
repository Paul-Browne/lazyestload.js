! function() {

    // wrapper, so we can call the function on both load and scroll events

    function lazyload() {

        // all the images with class lazyload

        var images = document.querySelectorAll("img.lazyload");
        var i = images.length;

        // remove the event listener if there are no images with the class lazyload

        !i && window.removeEventListener("scroll", lazyload);

        // loop de loop

        while (i--) {
            var wH = window.innerHeight;
            var offset = 100;
            var yPosition = images[i].getBoundingClientRect().top - wH;

            // if the top of the image is within 100px from the bottom of the viewport

            if (yPosition <= offset) {

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

                    // remove the class lazyload

                    this.classList.remove("lazyload");
                });

            }
        }
    }

    // run on load

    lazyload();

    // run on scroll event

    window.addEventListener("scroll", lazyload);
}();