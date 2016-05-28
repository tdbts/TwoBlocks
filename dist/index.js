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

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createPanorama = __webpack_require__(2);

	var _createPanorama2 = _interopRequireDefault(_createPanorama);

	var _createSpinner = __webpack_require__(3);

	var _createSpinner2 = _interopRequireDefault(_createSpinner);

	var _createWebGlManager = __webpack_require__(40);

	var _createWebGlManager2 = _interopRequireDefault(_createWebGlManager);

	var _selectRandomValueOfRange = __webpack_require__(46);

	var _selectRandomValueOfRange2 = _interopRequireDefault(_selectRandomValueOfRange);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* global document, google */

	/*=================================
	=            twoBlocks()          =
	=================================*/

	var twoBlocks = function twoBlocks() {

		// #################
		// LOCATION SETTINGS
		// #################

		var latitude = 40.6291566;
		var longitude = -74.0287341;

		var nycBoundaryPoints = [
		// NJ, above Bronx, West side
		[40.932251, -73.935757],
		// LI Sound, above Bronx, East side
		[40.866917, -73.750877],
		// Atlantic Ocean, just South of LI,
		// past Eastern border of Queens
		[40.567269, -73.66539],
		// Atlantic Ocean, just South of Rockaway penninsula and Brooklyn
		[40.519264, -73.946915],
		// (Lower Bay, Between Staten Island and Brooklyn) 
		[40.572485, -74.054031],
		// Just South of Staten Island
		[40.477492, -74.233932],
		// NJ, West of Staten Island
		[40.562052, -74.352036]];

		// #############
		// MORE SETTINGS
		// #############

		var canvasId = "canvas-streetviewpanorama";
		var canvas = document.getElementById(canvasId);
		// 'increment' controls the speed of panning
		// positive values pan to the right, negatives values pan to the left

		var webGlManager = (0, _createWebGlManager2.default)(canvas);

		var panoid = null;
		var spinner = void 0;

		/*----------  init()  ----------*/

		var init = function init(canvas, latitude, longitude) {

			var mode = webGlManager.canUseWebGl() ? "webgl" : "html4";

			var gps = new google.maps.LatLng(latitude, longitude);

			/*----------  Set up panorama  ----------*/

			var panorama = (0, _createPanorama2.default)(canvas, {
				mode: mode,
				pano: panoid,
				position: gps
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

			webGlManager.on('webglcontextrestored', function () {
				return spinner.spin();
			});

			/*----------  Set up WebGl  ----------*/

			if (webGlManager.canUseWebGl()) {

				setTimeout(function () {
					return webGlManager.initGl();
				}, 1000);
			}

			return { panorama: panorama, spinner: spinner };
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

			var map = new google.maps.Map(canvas, mapOptions);

			// Add a marker to the map.  Options define which map,
			// what location, and whether is visible. 
			var markerOptions = {
				map: map,
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

			return new Promise(function (resolve) {

				var script = document.createElement("script");

				var source = "https://maps.googleapis.com/maps/api/js";

				script.type = "text/javascript";

				if (MAPS_API_KEY) {

					source += '&key=' + MAPS_API_KEY;
				}

				script.src = source;
				script.onload = function () {
					return resolve();
				};

				document.body.appendChild(script);
			});
		};

		/*----------  Initialization  ----------*/

		injectGapiScript().then(function () {
			return init(canvas, latitude, longitude);
		})

		// Convert array of lat / lng values to an array
		// of LatLng class instances
		.then(function (appComponents) {

			var nycBoundaryLatLngs = [];

			nycBoundaryPoints.forEach(function (pointPair) {

				nycBoundaryLatLngs.push(new (Function.prototype.bind.apply(google.maps.LatLng, [null].concat(_toConsumableArray(pointPair))))());
			});

			return _extends({}, appComponents, { nycBoundaryLatLngs: nycBoundaryLatLngs });
		})

		// Create nycPolygon using the array of LatLng instances
		.then(function (appComponents) {
			var nycBoundaryLatLngs = appComponents.nycBoundaryLatLngs;


			var nycPolygon = new google.maps.Polygon({

				paths: nycBoundaryLatLngs

			});

			window.console.log("nycPolygon:", nycPolygon);

			return _extends({}, appComponents, { nycPolygon: nycPolygon });
		})

		// Create an object defining the min / max values
		// for both lat / lng of the NYC boundary points
		.then(function (appComponents) {
			var nycPolygon = appComponents.nycPolygon;


			var latLngMaxMin = {
				lat: {
					min: null,
					max: null
				},

				lng: {
					min: null,
					max: null
				}
			};

			latLngMaxMin = nycBoundaryPoints.reduce(function (prev, curr, i) {
				var lat = prev.lat;
				var lng = prev.lng;

				// On the first invocation, the Lat and Lng
				// values are both the min and max

				if (i === 0) {
					var _curr = _slicedToArray(curr, 2);

					var currLat = _curr[0];
					var currLng = _curr[1];


					lat.min = lat.max = currLat;
					lng.min = lng.max = currLng;
				} else {
					var _curr2 = _slicedToArray(curr, 2);

					var _currLat = _curr2[0];
					var _currLng = _curr2[1];


					lat.min = Math.min(lat.min, _currLat);
					lat.max = Math.max(lat.max, _currLat);
					lng.min = Math.min(lng.min, _currLng);
					lng.max = Math.max(lng.max, _currLng);
				}

				return prev;
			}, latLngMaxMin);

			window.console.log("latLngMaxMin:", latLngMaxMin);

			return _extends({}, appComponents, { latLngMaxMin: latLngMaxMin, nycPolygon: nycPolygon });
		})

		// Select random point from within min / max values for
		// lat / lng, and check if they fall within our defined
		// NYC polygon
		.then(function (appComponents) {

			return new Promise(function (resolve) {
				var latLngMaxMin = appComponents.latLngMaxMin;
				var nycPolygon = appComponents.nycPolygon;


				var getRandomNycCoords = function getRandomNycCoords(latLngMaxMin, selectRandomValueOfRange) {
					var lat = latLngMaxMin.lat;
					var lng = latLngMaxMin.lng;


					var randomLat = selectRandomValueOfRange(lat.min, lat.max).toFixed(6);

					var randomLng = selectRandomValueOfRange(lng.min, lng.max).toFixed(6);

					window.console.log("randomLat:", randomLat);
					window.console.log("randomLng:", randomLng);

					var randomCoords = { randomLat: randomLat, randomLng: randomLng };

					return randomCoords;
				};

				// Umm...Have to put a timeout, or else the 'geometry' library is not defined
				// yet on the google.maps object.  WTF Google.
				setTimeout(function () {
					var _getRandomNycCoords = getRandomNycCoords(latLngMaxMin, _selectRandomValueOfRange2.default);

					var randomLat = _getRandomNycCoords.randomLat;
					var randomLng = _getRandomNycCoords.randomLng;


					var randomLatLng = new google.maps.LatLng(randomLat, randomLng);

					var isWithinNycBoundaries = google.maps.geometry.poly.containsLocation(randomLatLng, nycPolygon);

					window.console.log("isWithinNycBoundaries:", isWithinNycBoundaries);

					resolve(_extends({}, appComponents, { getRandomNycCoords: getRandomNycCoords, latLngMaxMin: latLngMaxMin, nycPolygon: nycPolygon }));
				}, 1000);
			}).then(function (appComponents) {

				window.console.log("appComponents:", appComponents);

				var getRandomNycCoords = appComponents.getRandomNycCoords;
				var latLngMaxMin = appComponents.latLngMaxMin;
				var nycPolygon = appComponents.nycPolygon;


				var createRandomNycSpinner = function createRandomNycSpinner(getRandomNycCoords, latLngMaxMin, nycPolygon) {

					var isWithinNycBoundaries = false;
					var randomCoords = null;
					var randomLatLng = void 0;

					while (!isWithinNycBoundaries) {

						randomCoords = getRandomNycCoords(latLngMaxMin, _selectRandomValueOfRange2.default);

						var _randomCoords = randomCoords;
						var randomLat = _randomCoords.randomLat;
						var randomLng = _randomCoords.randomLng;


						randomLatLng = new google.maps.LatLng(randomLat, randomLng);

						isWithinNycBoundaries = google.maps.geometry.poly.containsLocation(randomLatLng, nycPolygon);
					}

					// return init(canvas, randomLat, randomLng);
					if (spinner) {

						spinner.stop();
					}

					var panorama = (0, _createPanorama2.default)(canvas, {
						mode: "webgl",
						position: randomLatLng
					});

					spinner = (0, _createSpinner2.default)(panorama, {
						punctuate: {
							segments: 4,
							delay: 2000
						}
					});

					spinner.start();
				};

				setInterval(function () {
					return createRandomNycSpinner(getRandomNycCoords, latLngMaxMin, nycPolygon);
				}, 10000);
			});
		});
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

	var createPanorama = function createPanorama(canvas) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


		var defaultOptions = {
			position: null,
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
			pano: null, // ID of panorama to use
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _utils = __webpack_require__(4);

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
		var VALID_SEGMENTS = [2, 4, 6, 9, 12];

		var segments = null;
		var delay = null;
		var increment = void 0;
		var interval = void 0;
		var timer = void 0;

		var handlePunctuationOption = function handlePunctuationOption(options) {

			var punctuateSettings = null;

			if ('punctuate' in options) {
				var _options$punctuate = options.punctuate;
				var _segments = _options$punctuate.segments;
				var _delay = _options$punctuate.delay;


				if (!(0, _utils.isOneOf)(VALID_SEGMENTS, _segments)) {

					_segments = null;
				}

				if (!_segments) {
					_segments = SEGMENTS_DEFAULT;
				}

				if (!_delay) {
					_delay = DELAY_DEFAULT;
				}

				punctuateSettings = { segments: _segments, delay: _delay };
			}

			return punctuateSettings;
		};

		var incrementHeading = function incrementHeading(pov, increment) {

			pov.heading += increment;

			while (pov.heading > DEGREES_IN_A_CIRCLE) {
				pov.heading -= DEGREES_IN_A_CIRCLE;
			}

			while (pov.heading < 0) {
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

			// Parentheses required when destructuring assigns
			// to previously declared variables. 
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

	/* global window */

	exports.default = createSpinner;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.typeIsValid = exports.truthyness = exports.throwErrorIfTrue = exports.throttle = exports.returnItem = exports.pipeline = exports.once = exports.noUniqueBetweenSets = exports.noArguments = exports.negate = exports.merge = exports.length = exports.keys = exports.hasKeys = exports.isType = exports.isSomething = exports.isOneOf = exports.isNothing = exports.isEmpty = exports.invoke = exports.halt = exports.getType = exports.getProp = exports.getOwnProp = exports.getArgumentsArray = exports.followPath = exports.existenceCheck = exports.extend = exports.emptyFunction = exports.debounce = exports.clone = exports.applyToOwnProp = exports.applyToAllOwnProps = undefined;

	var _applyToAllOwnProps = __webpack_require__(5);

	var _applyToAllOwnProps2 = _interopRequireDefault(_applyToAllOwnProps);

	var _applyToOwnProp = __webpack_require__(6);

	var _applyToOwnProp2 = _interopRequireDefault(_applyToOwnProp);

	var _clone = __webpack_require__(7);

	var _clone2 = _interopRequireDefault(_clone);

	var _debounce = __webpack_require__(10);

	var _debounce2 = _interopRequireDefault(_debounce);

	var _emptyFunction = __webpack_require__(11);

	var _emptyFunction2 = _interopRequireDefault(_emptyFunction);

	var _extend = __webpack_require__(12);

	var _extend2 = _interopRequireDefault(_extend);

	var _existenceCheck = __webpack_require__(19);

	var _existenceCheck2 = _interopRequireDefault(_existenceCheck);

	var _followPath = __webpack_require__(20);

	var _followPath2 = _interopRequireDefault(_followPath);

	var _getArgumentsArray = __webpack_require__(23);

	var _getArgumentsArray2 = _interopRequireDefault(_getArgumentsArray);

	var _getOwnProp = __webpack_require__(24);

	var _getOwnProp2 = _interopRequireDefault(_getOwnProp);

	var _getProp = __webpack_require__(25);

	var _getProp2 = _interopRequireDefault(_getProp);

	var _getType = __webpack_require__(8);

	var _getType2 = _interopRequireDefault(_getType);

	var _halt = __webpack_require__(26);

	var _halt2 = _interopRequireDefault(_halt);

	var _invoke = __webpack_require__(27);

	var _invoke2 = _interopRequireDefault(_invoke);

	var _isEmpty = __webpack_require__(28);

	var _isEmpty2 = _interopRequireDefault(_isEmpty);

	var _isNothing = __webpack_require__(21);

	var _isNothing2 = _interopRequireDefault(_isNothing);

	var _isOneOf = __webpack_require__(9);

	var _isOneOf2 = _interopRequireDefault(_isOneOf);

	var _isSomething = __webpack_require__(22);

	var _isSomething2 = _interopRequireDefault(_isSomething);

	var _isType = __webpack_require__(14);

	var _isType2 = _interopRequireDefault(_isType);

	var _hasKeys = __webpack_require__(29);

	var _hasKeys2 = _interopRequireDefault(_hasKeys);

	var _keys = __webpack_require__(18);

	var _keys2 = _interopRequireDefault(_keys);

	var _length = __webpack_require__(13);

	var _length2 = _interopRequireDefault(_length);

	var _merge = __webpack_require__(30);

	var _merge2 = _interopRequireDefault(_merge);

	var _negate = __webpack_require__(31);

	var _negate2 = _interopRequireDefault(_negate);

	var _noArguments = __webpack_require__(32);

	var _noArguments2 = _interopRequireDefault(_noArguments);

	var _noUniqueBetweenSets = __webpack_require__(33);

	var _noUniqueBetweenSets2 = _interopRequireDefault(_noUniqueBetweenSets);

	var _once = __webpack_require__(34);

	var _once2 = _interopRequireDefault(_once);

	var _pipeline = __webpack_require__(35);

	var _pipeline2 = _interopRequireDefault(_pipeline);

	var _returnItem = __webpack_require__(36);

	var _returnItem2 = _interopRequireDefault(_returnItem);

	var _throttle = __webpack_require__(37);

	var _throttle2 = _interopRequireDefault(_throttle);

	var _throwErrorIfTrue = __webpack_require__(38);

	var _throwErrorIfTrue2 = _interopRequireDefault(_throwErrorIfTrue);

	var _truthyness = __webpack_require__(39);

	var _truthyness2 = _interopRequireDefault(_truthyness);

	var _typeIsValid = __webpack_require__(15);

	var _typeIsValid2 = _interopRequireDefault(_typeIsValid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.applyToAllOwnProps = _applyToAllOwnProps2.default;
	exports.applyToOwnProp = _applyToOwnProp2.default;
	exports.clone = _clone2.default;
	exports.debounce = _debounce2.default;
	exports.emptyFunction = _emptyFunction2.default;
	exports.extend = _extend2.default;
	exports.existenceCheck = _existenceCheck2.default;
	exports.followPath = _followPath2.default;
	exports.getArgumentsArray = _getArgumentsArray2.default;
	exports.getOwnProp = _getOwnProp2.default;
	exports.getProp = _getProp2.default;
	exports.getType = _getType2.default;
	exports.halt = _halt2.default;
	exports.invoke = _invoke2.default;
	exports.isEmpty = _isEmpty2.default;
	exports.isNothing = _isNothing2.default;
	exports.isOneOf = _isOneOf2.default;
	exports.isSomething = _isSomething2.default;
	exports.isType = _isType2.default;
	exports.hasKeys = _hasKeys2.default;
	exports.keys = _keys2.default;
	exports.length = _length2.default;
	exports.merge = _merge2.default;
	exports.negate = _negate2.default;
	exports.noArguments = _noArguments2.default;
	exports.noUniqueBetweenSets = _noUniqueBetweenSets2.default;
	exports.once = _once2.default;
	exports.pipeline = _pipeline2.default;
	exports.returnItem = _returnItem2.default;
	exports.throttle = _throttle2.default;
	exports.throwErrorIfTrue = _throwErrorIfTrue2.default;
	exports.truthyness = _truthyness2.default;
	exports.typeIsValid = _typeIsValid2.default;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _applyToOwnProp = __webpack_require__(6);

	var _applyToOwnProp2 = _interopRequireDefault(_applyToOwnProp);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function applyToAllOwnProps(action, obj) {
		return Object.keys(obj).forEach(function (prop) {
			return (0, _applyToOwnProp2.default)(action, obj, prop);
		});
	}

	exports.default = applyToAllOwnProps;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function applyToOwnProp(action, obj, prop) {
		if (obj.hasOwnProperty(prop)) {
			return action(obj, prop);
		}
	}

	exports.default = applyToOwnProp;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getType = __webpack_require__(8);

	var _getType2 = _interopRequireDefault(_getType);

	var _isOneOf = __webpack_require__(9);

	var _isOneOf2 = _interopRequireDefault(_isOneOf);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Inspired by accepted answer at the following Stack Overflow question:
	// http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object


	function clone(obj) {
	    var result = void 0;
	    var copy = void 0;

	    // Handle the 3 simple types (string, number, boolean),
	    // as well as NaN, null or undefined
	    if ((0, _isOneOf2.default)(['null', 'undefined', 'NaN', 'string', 'number', 'boolean'], (0, _getType2.default)(obj))) {
	        result = obj;
	    } else if (obj instanceof Date) {
	        // Handle instances of Date
	        copy = new Date();

	        copy.setTime(obj.getTime());

	        result = copy;
	    } else if ('array' === (0, _getType2.default)(obj)) {
	        // Handle arrays

	        copy = [];

	        for (var i = 0, length = obj.length; i < length; i++) {
	            copy[i] = clone(obj[i]);
	        }

	        result = copy;
	    } else if ('object' === (0, _getType2.default)(obj)) {
	        // Handle objects
	        copy = {};

	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) {
	                copy[attr] = clone(obj[attr]);
	            }
	        }

	        result = copy;
	    }

	    return result;
	}

	exports.default = clone;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _isOneOf = __webpack_require__(9);

	var _isOneOf2 = _interopRequireDefault(_isOneOf);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Returns the type for any passed entitity. 
	// NaN actually evaluates to 'NaN', not "number" as per Javascript quirkiness.
	function getType(item) {

		var result = item !== item ? 'NaN' : Object.prototype.toString.call(item).slice(8, -1).toLowerCase();

		result = (0, _isOneOf2.default)(['arguments'], result) ? 'object' : result;

		return result;
	}

	exports.default = getType;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function isOneOf(matches, givenItem) {
		return matches.some(function (match) {
			return match === givenItem;
		});
	}

	exports.default = isOneOf;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/* SOURCE: https://davidwalsh.name/javascript-debounce-function */

	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead of the trailing.
	var debounce = function debounce(func, wait, immediate) {
		window.console.log('debounce()');
		var timeout = void 0;

		return function debouncer() {
			window.console.log('debouncer');
			var context = this;

			var args = arguments;

			var later = function later() {

				timeout = null;

				if (!immediate) {

					func.apply(context, args);
				}
			};

			var callNow = immediate && !timeout;

			clearTimeout(timeout);

			timeout = setTimeout(later, wait);

			if (callNow) {

				func.apply(context, args);
			}
		};
	};

	exports.default = debounce;

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function emptyFunction() {
		return function () {};
	}

	exports.default = emptyFunction;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _length = __webpack_require__(13);

	var _length2 = _interopRequireDefault(_length);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var extend = function extend(o, modifications) {
		for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
			rest[_key - 2] = arguments[_key];
		}

		if ((0, _length2.default)(rest) > 0) {
			var extension = extend(o, modifications);
			var args = rest;

			args.unshift(extension);

			return extend.apply(undefined, args);
		}

		var F = function F() {};

		if (modifications) {
			for (var prop in modifications) {
				o[prop] = modifications[prop];
			}
		}

		F.prototype = o;

		return new F();
	};

	exports.default = extend;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _isType = __webpack_require__(14);

	var _isType2 = _interopRequireDefault(_isType);

	var _getType = __webpack_require__(8);

	var _getType2 = _interopRequireDefault(_getType);

	var _keys = __webpack_require__(18);

	var _keys2 = _interopRequireDefault(_keys);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function length(item) {
		var result = void 0;

		if ((0, _isType2.default)(['array', 'string', 'function'], item)) {
			result = item.length;
		} else if ('object' === (0, _getType2.default)(item)) {
			result = length((0, _keys2.default)(item));
		}

		return result;
	}

	exports.default = length;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _getType = __webpack_require__(8);

	var _getType2 = _interopRequireDefault(_getType);

	var _typeIsValid = __webpack_require__(15);

	var _typeIsValid2 = _interopRequireDefault(_typeIsValid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var isType = function isType(types, item) {
		var result = void 0;

		if ('array' === (0, _getType2.default)(types)) {

			result = types.some(function (type) {
				return isType(type, item);
			});
		} else if ('string' === (0, _getType2.default)(types)) {
			var type = types;

			if ((0, _typeIsValid2.default)(type)) {
				result = type === (0, _getType2.default)(item);
			} else {
				throw new TypeError("Invalid type provided: " + type);
			}
		}

		return result;
	};

	exports.default = isType;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _isOneOf = __webpack_require__(9);

	var _isOneOf2 = _interopRequireDefault(_isOneOf);

	var _constants = __webpack_require__(16);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function typeisValid(givenType) {
		return (0, _isOneOf2.default)(_constants.ALL_TYPES, givenType);
	}

	exports.default = typeisValid;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.ALL_TYPES = undefined;

	var _ALL_TYPES = __webpack_require__(17);

	var _ALL_TYPES2 = _interopRequireDefault(_ALL_TYPES);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.ALL_TYPES = _ALL_TYPES2.default;

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	module.exports = ['NaN', 'array', 'boolean', 'date', 'error', 'function', 'null', 'number', 'object', 'regex', 'string', 'undefined'];

/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function keys(obj) {
		return Object.keys(obj);
	}

	exports.default = keys;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _followPath = __webpack_require__(20);

	var _followPath2 = _interopRequireDefault(_followPath);

	var _isNothing = __webpack_require__(21);

	var _isNothing2 = _interopRequireDefault(_isNothing);

	var _isType = __webpack_require__(14);

	var _isType2 = _interopRequireDefault(_isType);

	var _length = __webpack_require__(13);

	var _length2 = _interopRequireDefault(_length);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var existenceCheck = function existenceCheck(props, obj) {
		var result = false;

		if ((0, _isNothing2.default)(props) || (0, _length2.default)(props) < 1 || !(0, _isType2.default)(['string', 'array'], props)) {
			throw new Error("Missing or invalid properties passed to existenceCheck()");
		}

		try {
			(0, _followPath2.default)((0, _isType2.default)('array', props) ? props : [props], obj);

			result = true;
		} catch (ignore) {
			/* If followPath() throws an error, result will not be set to true. */
		}

		return result;
	};

	exports.default = existenceCheck;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _isType = __webpack_require__(14);

	var _isType2 = _interopRequireDefault(_isType);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 *
	 * @name followPath() 
	 *
	 * @desc Returns the entity located at the terminus of the 
	 *     given path within the given object of nested objects.
	 *
	 * @param { string[] } path - Array of strings delineating 
	 *     the path to follow.  
	 * @param { object } obj - The object where the path will be  
	 *     followed. 
	 * @param { object } options - An object for setting options.
	 *     - @prop { boolean } upsert - If true, in cases where the 
	 *         property does not exist within the current object, an 
	 *         empty object will be created at that property. 
	 *     - @prop { function } terminus - A function that will be 
	 *         called in order to set the value of the property 
	 *         located at the terminus of the given path.     
	 * 
	 * @returns { any }
	 *
	 */

	var followPath = function followPath(path, obj) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

		var result = void 0;

		if (path.length === 0) {
			result = obj;
		} else {
			var prop = path[0];

			if ((0, _isType2.default)('object', obj)) {

				if (!(prop in obj)) {

					if (path.length === 1 && 'terminus' in options) {

						obj[prop] = options.terminus(obj[prop], obj, prop);
					} else if ('upsert' in options && options.upsert) {

						obj[prop] = {};
					} else {

						throw new ReferenceError('The property ' + prop + ' does not exist in the object ' + JSON.stringify(obj));
					}
				} else if (path.length === 1 && 'terminus' in options && (0, _isType2.default)('function', options.terminus)) {

					obj[prop] = options.terminus(obj[prop], obj, prop);
				}
			} else {
				throw new Error('The path ' + path + ' is invalid for the entity ' + JSON.stringify(obj));
			}

			result = followPath(path.slice(1), obj[prop], options);
		}

		return result;
	};

	exports.default = followPath;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _isSomething = __webpack_require__(22);

	var _isSomething2 = _interopRequireDefault(_isSomething);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function isNothing(item) {
		return !(0, _isSomething2.default)(item);
	}

	exports.default = isNothing;

/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function isSomething(item) {
		return item !== null && item !== undefined;
	}

	exports.default = isSomething;

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// Obselete now that ES2015 is here, but
	// still useful in browsers for a couple of years. 

	function getArgumentsArray(args, start, end) {
		return Array.prototype.slice.call(args, start, end);
	}

	exports.default = getArgumentsArray;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _applyToOwnProp = __webpack_require__(6);

	var _applyToOwnProp2 = _interopRequireDefault(_applyToOwnProp);

	var _getProp = __webpack_require__(25);

	var _getProp2 = _interopRequireDefault(_getProp);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function getOwnProp(obj, prop) {
		var result = void 0;

		if (prop in obj) {
			result = (0, _applyToOwnProp2.default)(_getProp2.default, obj, prop);
		} else {
			throw new ReferenceError("The property '" + prop + "' does not exist in the provided object: " + JSON.stringify(obj));
		}

		return result;
	}

	exports.default = getOwnProp;

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function getProp(obj, prop) {
		return obj[prop];
	}

	exports.default = getProp;

/***/ },
/* 26 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/**
	 *
	 * halt() - Pass in a function and some arguments, and 
	 * 		it returns a function which will call the given 
	 * 		function with the given arguments.  Good for 
	 * 		when you want to set up an invocation, without 
	 * 		actually invoking yet.  
	 * 
	 * @param func { function } - Function to invoke. 
	 * @param args { array } - Arguments to pass on invocation. 
	 * 
	 * @returns { function } - Anonymous function which invokes the 
	 * 		given function with the given arguments.  
	 * 
	 */

	function halt(func, args) {
	  return function () {
	    func.call.apply(func, [this].concat(_toConsumableArray(args)));
	  };
	}

	exports.default = halt;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _isType = __webpack_require__(14);

	var _isType2 = _interopRequireDefault(_isType);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*==============================
	=            invoke()            =
	==============================*/

	var invoke = function invoke(obj, method) {
		if (obj && method && (0, _isType2.default)('function', obj[method])) {
			return obj[method]();
		}
	};

	/*=====  End of invoke()  ======*/

	exports.default = invoke;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _getType = __webpack_require__(8);

	var _getType2 = _interopRequireDefault(_getType);

	var _isType = __webpack_require__(14);

	var _isType2 = _interopRequireDefault(_isType);

	var _keys = __webpack_require__(18);

	var _keys2 = _interopRequireDefault(_keys);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function isEmpty(item) {
		var result = void 0;

		if ((0, _isType2.default)(['string', 'array'], item)) {
			result = item.length === 0;
		} else if ((0, _isType2.default)('object', item)) {
			result = isEmpty((0, _keys2.default)(item));
		} else {
			throw new Error("isEmpty() cannot be used on {" + item + "} because its type is: " + (0, _getType2.default)(item));
		}

		return result;
	}

	exports.default = isEmpty;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _isType = __webpack_require__(14);

	var _isType2 = _interopRequireDefault(_isType);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var keyExists = function keyExists(desiredKey, keys) {
		return keys.some(function (key) {
			return key === desiredKey;
		});
	};

	var hasKeys = function hasKeys(keys, obj) {
		var result = false;

		if ((0, _isType2.default)(['array', 'string'], keys) && (0, _isType2.default)('object', obj)) {

			if ((0, _isType2.default)('array', keys)) {
				result = keys.every(function (key) {
					return keyExists(key, Object.keys(obj));
				});
			} else {
				result = keyExists(keys, Object.keys(obj));
			}
		} else {
			throw new TypeError('The keys and/or object provided are of an invalid type: \n\t\t\t\tkeys: ' + keys + ' \n\t\t\t\tobject: ' + JSON.stringify(obj));
		}

		return result;
	};

	exports.default = hasKeys;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _applyToAllOwnProps = __webpack_require__(5);

	var _applyToAllOwnProps2 = _interopRequireDefault(_applyToAllOwnProps);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var addPropTo = function addPropTo(receiver) {
		return function (obj, prop) {
			receiver[prop] = obj[prop];
		};
	};

	var merge = function merge(first, second) {
		(0, _applyToAllOwnProps2.default)(addPropTo(first), second);
	};

	exports.default = merge;

/***/ },
/* 31 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function negate(action) {
		return function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return !action.apply(this, args);
		};
	}

	exports.default = negate;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _isEmpty = __webpack_require__(28);

	var _isEmpty2 = _interopRequireDefault(_isEmpty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var noArguments = function noArguments(args) {
		return (0, _isEmpty2.default)(args);
	};

	exports.default = noArguments;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _isOneOf = __webpack_require__(9);

	var _isOneOf2 = _interopRequireDefault(_isOneOf);

	var _isType = __webpack_require__(14);

	var _isType2 = _interopRequireDefault(_isType);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var noUniqueBetweenSets = function noUniqueBetweenSets(first, second) {

		if ((0, _isType2.default)('array', first) && (0, _isType2.default)('array', second)) {

			return first.every(function (item) {
				return (0, _isOneOf2.default)(second, item);
			}) && second.every(function (item) {
				return (0, _isOneOf2.default)(first, item);
			});
		}
	};

	exports.default = noUniqueBetweenSets;

/***/ },
/* 34 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// SOURCE: https://leanpub.com/javascriptallongesix/read

	// N.B: This will not work within constructors!
	// If used within a constructor's prototype, all
	// instances will have the same once function,
	// and the desired affect will not be achieved. 
	var once = function once(fn) {
		var hasRun = false;

		return function () {
			if (hasRun) return;

			hasRun = true;

			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return fn.apply(this, args);
		};
	};

	exports.default = once;

/***/ },
/* 35 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var pipeline = function pipeline() {
		for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
			fns[_key] = arguments[_key];
		}

		return function (value) {
			return fns.reduce(function (acc, fn) {
				return fn(acc);
			}, value);
		};
	};

	exports.default = pipeline;

/***/ },
/* 36 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function returnItem(item) {
		return function () {
			return item;
		};
	}

	exports.default = returnItem;

/***/ },
/* 37 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var throttle = function throttle(fn) {
		var threshhold = arguments.length <= 1 || arguments[1] === undefined ? 250 : arguments[1];
		var context = arguments.length <= 2 || arguments[2] === undefined ? this : arguments[2];


		var last = void 0;
		var deferTimer = void 0;

		return function throttler() {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			var now = +new Date();

			if (last && now < last + threshhold) {

				// hold onto it
				clearTimeout(deferTimer);

				deferTimer = setTimeout(function () {

					last = now;

					fn.apply(context, args);
				}, threshhold);
			} else {

				last = now;

				fn.apply(context, args);
			}
		};
	};

	exports.default = throttle;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _isSomething = __webpack_require__(22);

	var _isSomething2 = _interopRequireDefault(_isSomething);

	var _isType = __webpack_require__(14);

	var _isType2 = _interopRequireDefault(_isType);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function throwErrorIfTrue(action, item, error) {
		if ((0, _isType2.default)('function', action) && action(item)) {

			if ((0, _isSomething2.default)(error) && (0, _isType2.default)('error', error)) {
				throw error;
			} else {
				throw new Error('Threw error because given action \'' + action + '\' on item \'' + item + '\' returned true.');
			}
		}
	}

	exports.default = throwErrorIfTrue;

/***/ },
/* 39 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function truthyness(item) {
		return !!item;
	}

	exports.default = truthyness;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* global document, window */

	var _events = __webpack_require__(41);

	var _util = __webpack_require__(42);

	/*==========================================
	=            createWebGlManager            =
	==========================================*/

	var createWebGlManager = function createWebGlManager(canvas) {

		var WebGlManager = function WebGlManager(canvas) {

			this.canvas = canvas;
		};

		// Inherit from EventEmitter
		(0, _util.inherits)(WebGlManager, _events.EventEmitter);

		// Extend WebGlManager prototype with
		// desired functionality.
		_extends(WebGlManager.prototype, {
			canUseWebGl: function canUseWebGl() {

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
			},
			initGl: function initGl() {
				var _this = this;

				if (this.canvas) {

					this.canvas.addEventListener('webglcontextrestored', function () {
						return _this.emit('webglcontextrestored');
					});
				}
			}
		});

		// Return class instance which has inherited
		// our desired functionality
		return new WebGlManager(canvas);
	};

	/*=====  End of createWebGlManager  ======*/

	exports.default = createWebGlManager;

/***/ },
/* 41 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(44);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(45);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(43)))

/***/ },
/* 43 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 45 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 46 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var selectRandomValueOfRange = function selectRandomValueOfRange(min, max) {

		// If the order is incorrect, switch.
		if (!(min <= max)) {
			var _ref = [max, min];
			min = _ref[0];
			max = _ref[1];
		}

		var difference = max - min;

		return min + Math.random() * difference;
	};

	exports.default = selectRandomValueOfRange;

/***/ }
/******/ ]);