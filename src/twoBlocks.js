/* global document, google */

/*=================================
=            twoBlocks()            =
=================================*/

const twoBlocks = function twoBlocks() {
	
	// #################
	// LOCATION SETTINGS
	// #################

	const latitude = 40.6291566; 
	const longitude = -74.0287341; 

	// #############
	// MORE SETTINGS
	// #############

	// 'increment' controls the speed of panning
	// positive values pan to the right, negatives values pan to the left
	const increment = 1; 
	const interval = 25; 

	let panoid = null; 
	let panorama;
	let spinner;

	/*----------  initGl()  ----------*/
	
	const initGl = function initGl() {

		const c = document.getElementsByTagName("canvas").item(0);

		if (c) {

			c.addEventListener("webglcontextrestored", spinner.spin, false);
		
		}

	};	

	/*----------  canUseWebGl  ----------*/
	const canUseWebGl = function canUseWebGl() {
	
		if (!(window.WebGLRenderingContext)) return false; 

		const testCanvas = document.createElement('canvas');

		let result; 

		if (testCanvas && ('getContext' in testCanvas)) {

			const webGlNames = [
				"webgl",
				"experimental-webgl",
				"moz-webgl",
				"webkit-3d"
			];

			// Reduce the array of webGlNames to a single boolean, 
			// which represents the result of canUseWebGl().  
			result = webGlNames.reduce((prev, curr) => {
				
				if (prev) return prev;  // If 'prev' is truthy, we can use WebGL. 
			
				const context = testCanvas.getContext(curr); 

				if (context && (context instanceof WebGLRenderingContext)) return true; 

			}, false);  // Start with false (default) 

		}

		return result;	
	
	}; 

	/*----------  init()  ----------*/

	const init = function init(latitude, longitude, givenPanoramaOptions = {}) {
		
		const mode = canUseWebGl() ? "webgl" : "html4";

		const gps = new google.maps.LatLng(latitude, longitude);
			
		const defaultPanoramaOptions = {
			mode,
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
			// Pan Control shows a UI element that allows you to rotate the pano 
			panControl: false,
			panControlOptions: { position: google.maps.ControlPosition.TOP_LEFT },
			pano: panoid,
			position: gps,
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

		const panoramaOptions = Object.assign({}, defaultPanoramaOptions, givenPanoramaOptions); 
		
		const canvas = document.getElementById("canvas-streetviewpanorama");

		// Documentation on streetViewPanorama class: 
		// https://developers.google.com/maps/documentation/javascript/reference#StreetViewPanorama
		panorama = new google.maps.StreetViewPanorama(canvas, panoramaOptions);
		
		google.maps.event.addListener(panorama, 'closeclick', showMap);
		
		panorama.setPano(panoid);
		
		google.maps.event.addListener(panorama, 'pano_changed', () => {
			// getPano() --> [string] Returns the current panorama ID 
			// for the Street View panorama. This id is stable within 
			// the browser's current session only.
			panoid = panorama.getPano();
		
		});

		spinner = createSpinner(panorama, interval, {
			punctuate: {
				segments: 4, 
				delay: 2000
			}
		}); 
		
		spinner.start(); 

		if (mode === 'webgl') {

			setTimeout(initGl, 1000);
		
		}
		
		canvas.addEventListener('mouseover', () => spinner.stop()); 
		canvas.addEventListener('mouseout', () => spinner.start()); 

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
	const showMap = function showMap() {

		const canvas = document.getElementById("canvas-streetviewpanorama");
		
		// Remove event listeners created in init().  
		// Too tightly coupled here, maybe just emit an event. 
		canvas.onmouseover = function () {};
		canvas.onmouseout = function () {};
		
		spinner.stop(); 
		
		const gps = new google.maps.LatLng(latitude, longitude);
		
		const mapOptions = {
			center: gps,
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		panorama = new google.maps.Map(canvas, mapOptions);
		
		// Add a marker to the map.  Options define which map, 
		// what location, and whether is visible.  
		const markerOptions = {
			map: panorama,
			position: gps,
			visible: true
		};
		
		const marker = new google.maps.Marker(markerOptions);
		
		google.maps.event.addListener(marker, 'click', () => init(latitude, longitude, {}));
		
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
	 * Option will be called 'punctuate'.  Properties will be 
	 * 'segments' and 'delay'.  Valid options for segments will be
	 * even divisors of 360 -- 12 (30-degrees), 9 (40-degrees), 
	 * 6 (60-degrees), 4 (90-degrees), 2 (180-degrees)
	 * 
	 */

	const createSpinner = (panorma, interval, options = {}) => {

		const DEGREES_IN_A_CIRCLE = 360; 

		let segments = null; 
		let delay = null; 

		let timer;  

		const handlePunctuationOption = function handlePunctuationOption(options) {

			if ('punctuate' in options) {

				let { segments, delay } = options.punctuate; 

				if (!(segments)) {
					segments = 4; 
				} 

				if (!(delay)) {
					delay = 1000; 
				}

				return { segments, delay }; 

			}

		};

		const incrementHeading = function incrementHeading(pov, increment) {
		
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
		const punctuate = function punctuate(pov, segments, delay) {
			
			const { heading } = pov; 

			if ((heading % (DEGREES_IN_A_CIRCLE / segments)) === 0) {

				api.stop(); 

				setTimeout(() => api.start(), delay);

			} 
		
		};

		const punctuated = handlePunctuationOption(options); 

		if (punctuated) {

			segments = punctuated.segments; 
			delay = punctuated.delay; 
	
		}

		const api = {

			spin() {

				try {

					const pov = incrementHeading(panorma.getPov(), increment); 

					panorma.setPov(pov); 

					if (punctuated) {

						punctuate(pov, segments, delay); 
					
					}
				
				} catch (e) {
				
					window.console.error("e:", e); 
				
				}

			}, 

			start() {

				clearInterval(timer); 

				timer = setInterval(this.spin, interval); 

			}, 

			stop() {

				clearInterval(timer); 

			}
		
		};

		return api; 

	};

	/*----------  injectGapiScript()  ----------*/
	
	const injectGapiScript = function injectGapiScript(MAPS_API_KEY) {

		const script = document.createElement("script");
		
		let source = "https://maps.googleapis.com/maps/api/js"; 
		
		script.type = "text/javascript";
		
		if (MAPS_API_KEY) {
			
			source += "&key=" + MAPS_API_KEY;
		
		}

		script.src = source; 
		script.onload = () => init(latitude, longitude, {}); 

		document.body.appendChild(script);
	
	};

	injectGapiScript(); 		

}; 

/*=====  End of twoBlocks()  ======*/


export default twoBlocks; 
