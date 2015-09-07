# Favicount

Favicount a maintained fork/refactor of the `tinycon` library. It add
notification counts to your favicon for browser that support it and gracefully
degrades to nothing when the browser does not support these transformations.

## Installation

The module is against a commonjs module system and is released in the public npm
registry and can be installed by running:

```
npm install --save favicount
```

## Usage

In all examples we assume that you've already required the library as following:

```js
var favicount = require('favicount');
```

```javascript
favicount.set(6);
```

### configure

The following options can be configured:

* width: the width of the alert bubble
* height: the height of the alert bubble
* font: a CSS string to use for the fontface (recommended to leave this)
* color: the foreground font color
* background: the alert bubble background colour

```js
favicount
.configure('width', 9)
.configure('background', '#549A2F');
```

## Browser Support

Favicount has been tested to work completely in the following browsers. Older
versions may be supported, but haven't been tested:

* Chrome 15+
* Firefox 9+
* Opera 11+

## License / Credits

MIT

This is a re factored fork of the original Tinycon library, Tinycon is released
under the MIT license. Tinycon was inspired by
[Notificon](https://github.com/makeable/Notificon)
