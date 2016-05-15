/* global document, google */

import createPanorama from './createPanorama'; 
import createSpinner from './createSpinner'; 

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

	const canvasId = "canvas-streetviewpanorama"; 
	const canvas = document.getElementById(canvasId); 
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

	const init = function init(canvas, latitude, longitude) {
		
		const mode = canUseWebGl() ? "webgl" : "html4";

		const gps = new google.maps.LatLng(latitude, longitude);

		/*----------  Set up panorama  ----------*/
		
		panorama = createPanorama(canvas, gps, { 
			mode, 
			pano: panoid 
		}); 
		
		panorama.setPano(panoid);
	
		const mapOptions = {
			center: gps,
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};	 

		google.maps.event.addListener(panorama, 'closeclick', () => showMap(canvas, mapOptions));
		
		google.maps.event.addListener(panorama, 'pano_changed', () => {
			// getPano() --> [string] Returns the current panorama ID 
			// for the Street View panorama. This id is stable within 
			// the browser's current session only.
			panoid = panorama.getPano();
		
		});

		/*----------  Set up spinner  ----------*/
		
		spinner = createSpinner(panorama, {
			increment, 
			interval, 
			punctuate: {
				segments: 4, 
				delay: 2000
			}
		}); 
		
		spinner.start(); 

		canvas.addEventListener('mouseover', () => spinner.stop()); 
		canvas.addEventListener('mouseout', () => spinner.start()); 
		
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
	const showMap = function showMap(canvas, mapOptions) {

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
		const markerOptions = {
			map: panorama,
			position: mapOptions.center,
			visible: true
		};
		
		const marker = new google.maps.Marker(markerOptions);
		
		google.maps.event.addListener(marker, 'click', () => init(canvas, latitude, longitude));
		
	};

	/*----------  injectGapiScript()  ----------*/
	
	const injectGapiScript = function injectGapiScript(MAPS_API_KEY) {

		const script = document.createElement("script");
		
		let source = "https://maps.googleapis.com/maps/api/js"; 
		
		script.type = "text/javascript";
		
		if (MAPS_API_KEY) {
			
			source += `&key=${MAPS_API_KEY}`;
		
		}

		script.src = source; 
		script.onload = () => init(canvas, latitude, longitude); 

		document.body.appendChild(script);
	
	};

	injectGapiScript(); 		

}; 

/*=====  End of twoBlocks()  ======*/


export default twoBlocks; 
