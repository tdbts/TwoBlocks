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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createPanorama = __webpack_require__(2);

	var _createPanorama2 = _interopRequireDefault(_createPanorama);

	var _createSpinner = __webpack_require__(3);

	var _createSpinner2 = _interopRequireDefault(_createSpinner);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*=================================
	=            twoBlocks()            =
	=================================*/

	/* global document, google */

	var twoBlocks = function twoBlocks() {

		// #################
		// LOCATION SETTINGS
		// #################

		var latitude = 40.6291566;
		var longitude = -74.0287341;

		// #############
		// MORE SETTINGS
		// #############

		var canvasId = "canvas-streetviewpanorama";
		var canvas = document.getElementById(canvasId);
		// 'increment' controls the speed of panning
		// positive values pan to the right, negatives values pan to the left
		var increment = 1;
		var interval = 25;

		var panoid = null;
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

				var webGlNames = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"];

				// Reduce the array of webGlNames to a single boolean,
				// which represents the result of canUseWebGl(). 
				result = webGlNames.reduce(function (prev, curr) {

					if (prev) return prev; // If 'prev' is truthy, we can use WebGL.

					var context = testCanvas.getContext(curr);

					if (context && context instanceof WebGLRenderingContext) return true;
				}, false); // Start with false (default)
			}

			return result;
		};

		/*----------  init()  ----------*/

		var init = function init(canvas, latitude, longitude) {

			var mode = canUseWebGl() ? "webgl" : "html4";

			var gps = new google.maps.LatLng(latitude, longitude);

			/*----------  Set up panorama  ----------*/

			panorama = (0, _createPanorama2.default)(canvas, gps, {
				mode: mode,
				pano: panoid
			});

			panorama.setPano(panoid);

			var mapOptions = {
				center: gps,
				zoom: 16,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			google.maps.event.addListener(panorama, 'closeclick', function () {
				return showMap(canvas, mapOptions);
			});

			google.maps.event.addListener(panorama, 'pano_changed', function () {
				// getPano() --> [string] Returns the current panorama ID
				// for the Street View panorama. This id is stable within
				// the browser's current session only.
				panoid = panorama.getPano();
			});

			/*----------  Set up spinner  ----------*/

			spinner = (0, _createSpinner2.default)(panorama, {
				increment: increment,
				interval: interval,
				punctuate: {
					segments: 4,
					delay: 2000
				}
			});

			spinner.start();

			canvas.addEventListener('mouseover', function () {
				return spinner.stop();
			});
			canvas.addEventListener('mouseout', function () {
				return spinner.start();
			});

			/*----------  Set up WebGl  ----------*/

			if (canUseWebGl()) {

				setTimeout(initGl, 1000);
			}
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
		var showMap = function showMap(canvas, mapOptions) {

			// Remove event listeners created in init(). 
			// Too tightly coupled here, maybe just emit an event.
			canvas.onmouseover = function () {};
			canvas.onmouseout = function () {};

			// Same here.  Emit an event and stop the spinner on
			// that event. 
			spinner.stop();

			panorama = new google.maps.Map(canvas, mapOptions);

			// Add a marker to the map.  Options define which map,
			// what location, and whether is visible. 
			var markerOptions = {
				map: panorama,
				position: mapOptions.center,
				visible: true
			};

			var marker = new google.maps.Marker(markerOptions);

			google.maps.event.addListener(marker, 'click', function () {
				return init(canvas, latitude, longitude);
			});
		};

		/*----------  injectGapiScript()  ----------*/

		var injectGapiScript = function injectGapiScript(MAPS_API_KEY) {

			var script = document.createElement("script");

			var source = "https://maps.googleapis.com/maps/api/js";

			script.type = "text/javascript";

			if (MAPS_API_KEY) {

				source += '&key=' + MAPS_API_KEY;
			}

			script.src = source;
			script.onload = function () {
				return init(canvas, latitude, longitude);
			};

			document.body.appendChild(script);
		};

		injectGapiScript();
	};

	/*=====  End of twoBlocks()  ======*/

	exports.default = twoBlocks;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	/* global google */

	/*======================================
	=            createPanorama()          =
	======================================*/

	var createPanorama = function createPanorama(canvas, position) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];


		var defaultOptions = {
			position: position,
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
			linksControl: false,
			mode: "webgl",
			// Pan Control shows a UI element that allows you to rotate the pano
			panControl: false,
			panControlOptions: { position: google.maps.ControlPosition.TOP_LEFT },
			pano: null,
			pov: {
				zoom: 1.1,
				heading: 0,
				pitch: 0
			},
			scrollwheel: false,
			visible: true,
			// Zoom control functionality is obvious
			zoomControl: false,
			zoomControlOptions: {
				position: google.maps.ControlPosition.TOP_LEFT,
				style: google.maps.ZoomControlStyle.DEFAULT
			}
		};

		var panoramaOptions = _extends({}, defaultOptions, options);

		// Documentation on streetViewPanorama class:
		// https://developers.google.com/maps/documentation/javascript/reference#StreetViewPanorama
		return new google.maps.StreetViewPanorama(canvas, panoramaOptions);
	};

	/*=====  End of createPanorama()  ======*/

	exports.default = createPanorama;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/* global window */

	/*=====================================
	=            createSpinner()            =
	=====================================*/

	/**
	 *
	 * Add options object as last parameter.  Add option to 
	 * not spin continuously, but rather, in a series of 
	 * partial-spins.  Should be able to split the 360 degrees 
	 * into "chunks", spin to one chunk, pause for a few 
	 * seconds, and then continue to the next one.  
	 *
	 * Option will be called 'punctuate'.  Properties will be 
	 * 'segments' and 'delay'.  Valid options for segments will be
	 * even divisors of 360 -- 12 (30-degrees), 9 (40-degrees), 
	 * 6 (60-degrees), 4 (90-degrees), 2 (180-degrees)
	 * 
	 */

	var createSpinner = function createSpinner(panorma) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


		var DEGREES_IN_A_CIRCLE = 360;
		var DELAY_DEFAULT = 1000; // Milliseconds 
		var INCREMENT_DEFAULT = 1; // Degrees
		var INTERVAL_DEFAULT = 25; // Milliseconds
		var SEGMENTS_DEFAULT = 4;

		var segments = null;
		var delay = null;
		var increment = void 0;
		var interval = void 0;
		var timer = void 0;

		var handlePunctuationOption = function handlePunctuationOption(options) {

			if ('punctuate' in options) {
				var _options$punctuate = options.punctuate;
				var _segments = _options$punctuate.segments;
				var _delay = _options$punctuate.delay;


				if (!_segments) {
					_segments = SEGMENTS_DEFAULT;
				}

				if (!_delay) {
					_delay = DELAY_DEFAULT;
				}

				return { segments: _segments, delay: _delay };
			}
		};

		var incrementHeading = function incrementHeading(pov, increment) {

			pov.heading += increment;

			while (pov.heading > DEGREES_IN_A_CIRCLE) {
				pov.heading -= DEGREES_IN_A_CIRCLE;
			}

			while (pov.heading < 0.0) {
				pov.heading += DEGREES_IN_A_CIRCLE;
			}

			return pov;
		};

		// Initial implementation assumes that we are incrementing
		// the spin by one degree each time we call spin(). 
		// TODO: Make this more sophisticated and robust. 
		var punctuate = function punctuate(pov, segments, delay) {

			// Heading is the number of degrees from cardinal direction North
			var heading = pov.heading;

			// The valid values for 'segments' evenly divide 360 degrees. 
			// If the heading is evenly divisible by the number of degrees
			// in each segment, the spinning has completed one partial
			// rotation, and it is time to pause the movement. 

			if (heading % (DEGREES_IN_A_CIRCLE / segments) === 0) {

				api.stop();

				// If we were to pause the spinning on mouseover as
				// the original author chose to do, we wouldn't actually
				// want to start spinning when this timeout expires. 
				// So we would need to read the mouseover state somehow
				// and start only when the timeout has expired AND the
				// mouse has left the canvas <div>.  This is where something
				// like Redux is going to shine. 
				setTimeout(function () {
					return api.start();
				}, delay);
			}
		};

		/*----------  Set punctuation options  ----------*/

		var punctuated = handlePunctuationOption(options);

		if (punctuated) {
			segments = punctuated.segments;
			delay = punctuated.delay;
		}

		/*----------  Set increment option  ----------*/
		increment = options.increment;


		if (!increment) {

			increment = INCREMENT_DEFAULT; // Degrees
		}

		/*----------  Set interval option  ----------*/
		interval = options.interval;


		if (!interval) {

			interval = INTERVAL_DEFAULT;
		}

		var api = {
			spin: function spin() {

				try {

					var pov = incrementHeading(panorma.getPov(), increment);

					panorma.setPov(pov);

					if (punctuated) {

						punctuate(pov, segments, delay);
					}
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

		return api;
	};

	/*=====  End of createSpinner()  ======*/

	exports.default = createSpinner;

/***/ }
/******/ ]);