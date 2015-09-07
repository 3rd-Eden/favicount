'use strict';

//
// References to the various of favicons that we need to track to reset and
// update the counters.
//
var original = null
  , current = null
  , favicon = null;

//
// Calculate the size of the font and canvas element based on device's ratio.
//
var ratio = Math.ceil(window.devicePixelRatio) || 1
  , size = 16 * ratio;

//
// Default options.
//
var options = {
  font: 10 * ratio + 'px arial',  // font for icon.
  background: '#F03D25',          // background color.
  crossOrigin: true,              // cross origin favicon.
  color: '#ffffff',               // font color.
  height: 9,                      // size.
  width: 7,                       // size.
};

//
// Setup the source canvas element which we use to generate the favicon's
// data-url's from.
//
var canvas = document.createElement('canvas');
canvas.width = size;
canvas.height = size;

//
// We unfortunately need to do some browser sniffing here as the difference in
// render engines are affecting the size of rendered text.
//
var webkit = browser('chrome') || browser('safari')
  , mozilla = browser('mozilla') && !webkit;

/**
 * A poor man's browser sniffer.
 *
 * @param {String} id Identifier of the browser
 * @returns {Boolean}
 * @api private
 */
function browser(id) {
  return !!~navigator.userAgent.toLowerCase().indexOf(id);
}

/**
 * Get the current favicon of the document.
 *
 * @returns {DOM} The found DOM element
 * @api private
 */
function getFaviconTag(){
  var links = document.getElementsByTagName('link')
    , l = links.length
    , i = 0;

  for(; i < l; i++) {
    if ((links[i].getAttribute('rel') || '').match(/\bicon\b/)) {
      return links[i];
    }
  }
}

/**
 * Return the current used favicon.
 *
 * @returns {String} The favicon url.
 * @api private
 */
function getCurrentFavicon(){
  if (!original || !current) {
    var tag = getFaviconTag();

    original = current = tag ? tag.getAttribute('href') : '/favicon.ico';
  }

  return current;
}

/**
 * Update the favicon.
 *
 * @api private
 */
function setFaviconTag(url){
  if (!url) return;

  var link = document.createElement('link')
    , tag = getFaviconTag();

  //
  // Remove the old favicon tags.
  //
  while (tag) {
    tag.parentNode.removeChild(tag);
    tag = getFaviconTag();
  }

  link.type = 'image/x-icon';
  link.rel = 'icon';
  link.href = url;

  document.getElementsByTagName('head')[0].appendChild(link);
}

/**
 * Draw the favicon.
 *
 * @param {String|Number} label text on the icon
 * @param {String} color Bubble color.
 * @api private
 */
function drawFavicon(label, color) {
  color = color || '#000000';

  var context = canvas.getContext('2d')
    , src = getCurrentFavicon();

  favicon = document.createElement('img');
  favicon.onload = function onload() {
    context.clearRect(0, 0, size, size);
    context.drawImage(favicon, 0, 0, favicon.width, favicon.height, 0, 0, size, size);

    // draw bubble over the top
    if ((label + '').length > 0) {
      drawBubble(context, label, color);
    }

    // refresh tag in page
    setFaviconTag(canvas.toDataURL());
  };

  //
  // allow cross origin resource requests if the image is not a data:uri
  // as detailed here: https://github.com/mrdoob/three.js/issues/1305
  //
  if (!src.match(/^data/) && options.crossOrigin) {
    favicon.crossOrigin = 'anonymous';
  }

  favicon.src = src;
}

/**
 * Generate the bubble on the canvas.
 *
 * @param {Context} context Canvas context.
 * @param {String} label Text in the bubble.
 * @param {String} color Background color.
 * @api private
 */
function drawBubble(context, label, color) {
  var len = (label + '').length - 1
    , width = options.width * ratio + (6 * ratio * len)
    , height = options.height * ratio
    , top = size - height
    , left = size - width - ratio
    , bottom = 16 * ratio
    , right = 16 * ratio
    , radius = 2 * ratio;

  //
  // Webkit seems to render fonts lighter than FireFox
  //
  context.font = (browser.webkit ? 'bold ' : '') + options.font;
  context.fillStyle = options.background;
  context.strokeStyle = options.background;
  context.lineWidth = ratio;

  //
  // Draw the bubble that holds the label.
  //
  context.beginPath();
  context.moveTo(left + radius, top);
  context.quadraticCurveTo(left, top, left, top + radius);
  context.lineTo(left, bottom - radius);
  context.quadraticCurveTo(left, bottom, left + radius, bottom);
  context.lineTo(right - radius, bottom);
  context.quadraticCurveTo(right, bottom, right, bottom - radius);
  context.lineTo(right, top + radius);
  context.quadraticCurveTo(right, top, right - radius, top);
  context.closePath();
  context.fill();

  //
  // Bottom shadow.
  //
  context.beginPath();
  context.strokeStyle = 'rgba(0,0,0,0.3)';
  context.moveTo(left + radius / 2.0, bottom);
  context.lineTo(right - radius / 2.0, bottom);
  context.stroke();

  //
  // label.
  //
  context.fillStyle = options.color;
  context.textAlign = 'right';
  context.textBaseline = 'top';

  //
  // Unfortunately Webkit/Mozilla are a pixel different in text positioning
  //
  context.fillText(
    label,
    ratio === 2 ? 29 : 15,
    browser.mozilla ? 7 * ratio : 6 * ratio
  );
}

//
// Expose the public Favicount interface.
//
module.exports = {
  /**
   * Update one or more of the configuration values.
   *
   * @param {String} key Which property do we want to update.
   * @param {String} value The value of the property.
   * @api public
   */
  configure: function configure(key, value) {
    options[key] = value || options[key];

    return this;
  },

  /**
   * Update the favicon with a new label.
   *
   * @param {String|Number} label Label on the icon.
   * @param {String} color Color of the label.
   * @returns {Boolean} Rendered favicon.
   * @api public
   */
  set: function set(label, color) {
    if (!canvas.getContext) return false;
    drawFavicon(label || '', color);

    return true;
  },

  /**
   * Restore the favicon to it's original self.
   *
   * @api public
   */
  reset: function reset(){
    setFaviconTag(original);
  }
};
