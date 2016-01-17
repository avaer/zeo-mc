"use strict";

module.exports = function() {

	var supportsCSSText = getComputedStyle(document.body).cssText !== "";

	function copyCSS(elem, origElem, log) {

		var computedStyle = getComputedStyle(origElem);

		if(supportsCSSText) {
			elem.style.cssText = computedStyle.cssText;

		} else {

			// Really, Firefox?
			for(var prop in computedStyle) {
				if(isNaN(parseInt(prop, 10)) && typeof computedStyle[prop] !== 'function' && !(/^(cssText|length|parentRule)$/).test(prop)) {
					elem.style[prop] = computedStyle[prop];
				}
			}

		}

	}

	function inlineStyles(elem, origElem) {

		var children = elem.querySelectorAll('*');
		var origChildren = origElem.querySelectorAll('*');

		// copy the current style to the clone
		copyCSS(elem, origElem, 1);

		// collect all nodes within the element, copy the current style to the clone
		Array.prototype.forEach.call(children, function(child, i) {
			copyCSS(child, origChildren[i]);
		});

		// strip margins from the outer element
		elem.style.margin = elem.style.marginLeft = elem.style.marginTop = elem.style.marginBottom = elem.style.marginRight = '';

	}

	function inlineImages(elem, cb) {
		var imgs = elem.querySelectorAll('img');
		var pending = 0;
		function makePend(img) {
			pending++;

			return function(src) {
				img.src = src;

				if (--pending) {
					cb();
				}
			};
		}

		function waitForLoad(img, cb) {
			if (img.complete) {
				requestAnimationFrame(function() {
					cb();
				});
			} else {
				img.onload = cb;
				img.onerror = cb;
			}
		}

		Array.prototype.forEach.call(imgs, function(img) {
			var pend = makePend(img);

			waitForLoad(img, function() {
				var canvas = document.createElement('canvas');
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;

				var ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

				var dataURL = canvas.toDataURL();
				pend(dataURL);
			});
		});
	}

	window.domvas = {

		toImage: function(origElem, callback, width, height, left, top) {

			left = (left || 0);
			top = (top || 0);

			var elem = origElem.cloneNode(true);

			// inline all CSS (ugh..)
			inlineStyles(elem, origElem);

            // inline all images
            inlineImages(elem, function() {
				// unfortunately, SVG can only eat well formed XHTML
				elem.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

				// serialize the DOM node to a String
				var serialized = new XMLSerializer().serializeToString(elem);

				// Create well formed data URL with our DOM string wrapped in SVG
				var dataUri = "data:image/svg+xml," +
					"<svg xmlns='http://www.w3.org/2000/svg' width='" + ((width || origElem.offsetWidth) + left) + "' height='" + ((height || origElem.offsetHeight) + top) + "'>" +
						"<foreignObject width='100%' height='100%' x='" + left + "' y='" + top + "'>" +
						serialized +
						"</foreignObject>" +
					"</svg>";

				// create new, actual image
				var img = new Image();
				img.src = dataUri;

				// when loaded, fire onload callback with actual image node
				img.onload = function() {
					if(callback) {
						callback.call(this, this);
					}
				};
			});

		}

	};

};
