/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _twoBlocks = __webpack_require__(1);

	var _twoBlocks2 = _interopRequireDefault(_twoBlocks);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(0, _twoBlocks2.default)();

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	/* global document, google */

	/*=================================
	=            twoBlocks()            =
	=================================*/

	var twoBlocks = function twoBlocks() {

		// CHANGE THE BELOW URL BETWEEN THE QUOTES
		// var embedUrl = "https://maps.google.com/maps?q=1516+W+Arthur+Ave,+Chicago,+IL&hl=en&ll=41.999942,-87.668645&spn=0.010796,0.020363&sll=41.999949,-87.668677&layer=c&cbp=13,289.04,,0,13.77&cbll=41.999936,-87.668635&hnear=1516+W+Arthur+Ave,+Chicago,+Illinois+60626&t=m&z=16&iwloc=A&panoid=HAvjga5mCucRKAGYvRxy0g

		// ALL YOU NEED IS LONGITUDE AND LATITUDE
		// Lat / Long will be randomly chosen within pre-defined NYC bounds
		var embedUrl = "https://maps.google.com/maps?ll=40.6291566,-74.0287341";
		// CHANGE THE ABOVE URL BETWEEN THE QUOTES

		/*----------  getUrlParameters()  ----------*/

		var getUrlParameters = function getUrlParameters(url) {

			// The original author of this code was not very experienced with Javascript. 
			// I changed 'parameters' (originally 'vars') from an array to
			// an object to make it appropriate for how the author has used it. 
			var parameters = {};

			var hash = void 0;

			// Get the string of everything after the '?' in the url,
			// and split it into an array of parameter key/value pairs
			var hashes = url.slice(url.indexOf('?') + 1).split('&');

			// For each parameter key/value pair, split the pair at the '='
			// character and add the key / value pair to the 'parameters' object 
			for (var i = 0; i < hashes.length; i++) {

				hash = hashes[i].split('=');

				var _hash = hash;

				var _hash2 = _slicedToArray(_hash, 2);

				var prop = _hash2[0];
				var val = _hash2[1];


				parameters[prop] = val;
			}

			return parameters;
		};

		// Create embed url parameter object
		var embedUrlParams = getUrlParameters(embedUrl);

		/*----------  getUrlParameter()  ----------*/

		var getUrlParameter = function getUrlParameter(obj, name) {

			return obj[name];
		};

		// Convert the latlong string into an array
		var latlong = getUrlParameter(embedUrlParams, 'll').split(',');

		// #################
		// LOCATION SETTINGS
		// #################

		var _latlong = _slicedToArray(latlong, 2);

		var latitude = _latlong[0];
		var longitude = _latlong[1];


		latitude = parseFloat(latitude);
		longitude = parseFloat(longitude);

		var panoid = getUrlParameter(embedUrlParams, 'panoid');

		// #############
		// MORE SETTINGS
		// #############

		// 'increment' controls the speed of panning
		// positive values pan to the right, negatives values pan to the left
		var increment = 1.2;
		var interval = 30;

		var panorama = void 0;
		var spinner = void 0;

		/*----------  initGl()  ----------*/

		var initGl = function initGl() {

			var c = document.getElementsByTagName("canvas").item(0);

			if (c) {

				c.addEventListener("webglcontextrestored", spinner.spin, false);
			}
		};

		/*----------  canUseWebGl  ----------*/
		var canUseWebGl = function canUseWebGl() {

			if (!window.WebGLRenderingContext) return false;

			var testCanvas = document.createElement('canvas');

			var result = void 0;

			if (testCanvas && 'getContext' in testCanvas) {

				// document.getElementsByTagName("body").item(0).appendChild(testCanvas);

				var webGlNames = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"];

				// Reduce the array of webGlNames to a single boolean, which
				// represents the result of canUseWebGl(). 
				result = webGlNames.reduce(function (prev, curr) {

					if (prev) return prev; // If 'prev' is truthy, we can use WebGL.

					var context = testCanvas.getContext(curr);

					if (context && context instanceof WebGLRenderingContext) return true;
				}, false); // Start with false
			}

			return result;
		};

		/*----------  init()  ----------*/

		var init = function init() {
			var givenPanoramaOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


			var mode = canUseWebGl() ? "webgl" : "html4";

			var gps = new google.maps.LatLng(latitude, longitude);

			var defaultPanoramaOptions = {
				mode: mode,
				// Address control shows a box with basic information about the
				// location, as well as a link to see the map on Google Maps
				addressControl: false,
				addressControlOptions: { position: google.maps.ControlPosition.TOP_LEFT },
				// clickToGo shows a rectangular "highlight" under the cursor, and on
				// click, the street view moves to the location clicked upon.  We will
				// want to keep this disabled for the game.			
				clickToGo: false,
				disableDoubleClickZoom: true,
				// Below, we add an event listener to 'closeclick', which fires when
				// the close button is clicked.  In the original author's implementation,
				// the application reveals the map on 'closeclick'.  			
				enableCloseButton: false,
				imageDateControl: false,
				// Pan Control shows a UI element that allows you to rotate the pano
				panControl: false,
				panControlOptions: { position: google.maps.ControlPosition.TOP_LEFT },
				scrollwheel: false,
				// Zoom control functionality is obvious
				zoomControl: false,
				zoomControlOptions: {
					position: google.maps.ControlPosition.TOP_LEFT,
					style: google.maps.ZoomControlStyle.DEFAULT
				},
				linksControl: false,
				pano: panoid,
				position: gps,
				pov: {
					zoom: 1.1,
					heading: 0,
					pitch: 0
				},
				visible: true
			};

			var panoramaOptions = _extends({}, defaultPanoramaOptions, givenPanoramaOptions);

			var canvas = document.getElementById("canvas-streetviewpanorama");

			// Documentation on streetViewPanorama class:
			// https://developers.google.com/maps/documentation/javascript/reference#StreetViewPanorama
			panorama = new google.maps.StreetViewPanorama(canvas, panoramaOptions);

			google.maps.event.addListener(panorama, 'closeclick', showMap);

			panorama.setPano(panoid);

			google.maps.event.addListener(panorama, 'pano_changed', function () {
				// getPano() --> [string] Returns the current panorama ID
				// for the Street View panorama. This id is stable within
				// the browser's current session only.
				panoid = panorama.getPano();
			});

			spinner = createSpinner(panorama, interval);

			spinner.start();

			if (mode === 'webgl') {

				setTimeout(initGl, 1000);
			}

			canvas.addEventListener('mouseover', function () {
				return spinner.stop();
			});
			canvas.addEventListener('mouseout', function () {
				return spinner.start();
			});
		};

		/*----------  showMap()  ----------*/

		/**
	  *
	  * It does not lie.  It shows the map.  
	  *
	  */

		// Refactor this to make this a more generally useful pure function. 
		// Pass in canvas element, and LatLong instance.  Remove side effect
		// of assigning to 'panorama' variable. 
		var showMap = function showMap() {

			var canvas = document.getElementById("canvas-streetviewpanorama");

			// Remove event listeners created in init(). 
			// Too tightly coupled here, maybe just emit an event.
			canvas.onmouseover = function () {};
			canvas.onmouseout = function () {};

			spinner.stop();

			var gps = new google.maps.LatLng(latitude, longitude);

			var mapOptions = {
				center: gps,
				zoom: 16,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			panorama = new google.maps.Map(canvas, mapOptions);

			// Add a marker to the map.  Options define which map,
			// what location, and whether is visible. 
			var markerOptions = {
				map: panorama,
				position: gps,
				visible: true
			};

			var marker = new google.maps.Marker(markerOptions);

			google.maps.event.addListener(marker, 'click', init);
		};

		/*----------  createSpinner()  ----------*/

		/**
	  *
	  * Add options object as last parameter.  Add option to 
	  * not spin continuously, but rather, in a series of 
	  * partial-spins.  Should be able to split the 360 degrees 
	  * into "chunks", spin to one chunk, pause for a few 
	  * seconds, and then continue to the next one.  
	  *
	  */

		var createSpinner = function createSpinner(panorma, interval) {

			var timer = void 0;

			return {
				spin: function spin() {

					try {

						var pov = panorma.getPov();

						pov.heading += increment;

						while (pov.heading > 360.0) {
							pov.heading -= 360.0;
						}

						while (pov.heading < 0.0) {
							pov.heading += 360.0;
						}

						panorma.setPov(pov);
					} catch (e) {

						window.console.error("e:", e);
					}
				},
				start: function start() {

					clearInterval(timer);

					timer = setInterval(this.spin, interval);
				},
				stop: function stop() {

					clearInterval(timer);
				}
			};
		};

		/*----------  injectGapiScript()  ----------*/

		var injectGapiScript = function injectGapiScript(MAPS_API_KEY) {

			var script = document.createElement("script");

			var source = "https://maps.googleapis.com/maps/api/js";

			script.type = "text/javascript";

			if (MAPS_API_KEY) {

				source += "&key=" + MAPS_API_KEY;
			}

			script.src = source;
			script.onload = init;

			document.body.appendChild(script);
		};

		injectGapiScript();
	};

	/*=====  End of twoBlocks()  ======*/

	exports.default = twoBlocks;

/***/ }
/******/ ]);