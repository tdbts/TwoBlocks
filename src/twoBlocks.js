/* global document, google */

/*=================================
=            twoBlocks()            =
=================================*/

const twoBlocks = function twoBlocks() {

	// CHANGE THE BELOW URL BETWEEN THE QUOTES
	// var embedUrl = "https://maps.google.com/maps?q=1516+W+Arthur+Ave,+Chicago,+IL&hl=en&ll=41.999942,-87.668645&spn=0.010796,0.020363&sll=41.999949,-87.668677&layer=c&cbp=13,289.04,,0,13.77&cbll=41.999936,-87.668635&hnear=1516+W+Arthur+Ave,+Chicago,+Illinois+60626&t=m&z=16&iwloc=A&panoid=HAvjga5mCucRKAGYvRxy0g

	// ALL YOU NEED IS LONGITUDE AND LATITUDE 
	// Lat / Long will be randomly chosen within pre-defined NYC bounds 
	const embedUrl = "https://maps.google.com/maps?ll=40.6291566,-74.0287341";
	// CHANGE THE ABOVE URL BETWEEN THE QUOTES

	/*----------  getUrlParameters()  ----------*/

	const getUrlParameters = function getUrlParameters(url) {

		// The original author of this code was not very experienced with Javascript.  
		// I changed 'parameters' (originally 'vars') from an array to 
		// an object to make it appropriate for how the author has used it.  
		const parameters = {};

		let hash;

		// Get the string of everything after the '?' in the url, 
		// and split it into an array of parameter key/value pairs 
		const hashes = url.slice(url.indexOf('?') + 1).split('&');

		// For each parameter key/value pair, split the pair at the '=' 
		// character and add the key / value pair to the 'parameters' object  
		for (let i = 0; i < hashes.length; i++) {

			hash = hashes[i].split('=');

			const [ prop, val ] = hash; 
 
			parameters[prop] = val;
		
		} 

		return parameters;
	};

	// Create embed url parameter object 
	const embedUrlParams = getUrlParameters(embedUrl); 

	/*----------  getUrlParameter()  ----------*/
	
	const getUrlParameter = function getUrlParameter(obj, name) {
		
		return obj[name];
	
	}; 

	// Convert the latlong string into an array 
	const latlong = getUrlParameter(embedUrlParams, 'll').split(',');
	
	// #################
	// LOCATION SETTINGS
	// #################
	let [latitude, longitude] = latlong; 

	latitude = parseFloat(latitude); 
	longitude = parseFloat(longitude); 
	
	let panoid = getUrlParameter(embedUrlParams, 'panoid');

	// #############
	// MORE SETTINGS
	// #############

	const zoom = 1.1;
	// 'increment' controls the speed of panning
	// positive values pan to the right, negatives values pan to the left
	const increment = 1.2;
	const interval = 30;

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

			// document.getElementsByTagName("body").item(0).appendChild(testCanvas);

			const webGlNames = [
				"webgl",
				"experimental-webgl",
				"moz-webgl",
				"webkit-3d"
			];

			// Reduce the array of webGlNames to a single boolean, which 
			// represents the result of canUseWebGl().  
			result = webGlNames.reduce((prev, curr) => {
				
				if (prev) return prev;  // If 'prev' is truthy, we can use WebGL. 
			
				const context = testCanvas.getContext(curr); 

				if (context && (context instanceof WebGLRenderingContext)) return true; 

			}, false);  // Start with false 

		}

		return result;	
	
	}; 

	/*----------  init()  ----------*/

	const init = function init(givenPanoramaOptions = {}) {
		
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
				zoom,		
				heading: 0,
				pitch: 0
			},
			visible: true
		};

		const panoramaOptions = Object.assign({}, defaultPanoramaOptions, givenPanoramaOptions); 
		
		const canvas = document.getElementById("canvas-streetviewpanorama");

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
		
		canvas.addEventListener('mouseover', () => spinner.stop()); 
		canvas.addEventListener('mouseout', () => spinner.start()); 

	};

	/*----------  showMap()  ----------*/

	/**
	 *
	 * It does not lie.  It shows the map.  
	 *
	 */
	
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
		
		const markerOptions = {
			map: panorama,
			position: gps,
			visible: true
		};
		
		const marker = new google.maps.Marker(markerOptions);
		
		google.maps.event.addListener(marker, 'click', init);
		
	};

	/*----------  createSpinner()  ----------*/
	
	const createSpinner = (panorma, interval) => {

		let timer;  

		return {

			spin() {

				try {

					const pov = panorma.getPov(); 

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

			start() {

				clearInterval(timer); 

				timer = setInterval(this.spin, interval); 

			}, 

			stop() {

				clearInterval(timer); 

			}
		
		};

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
		script.onload = init; 

		document.body.appendChild(script);
	
	};

	injectGapiScript(); 		

}; 

/*=====  End of twoBlocks()  ======*/


export default twoBlocks; 
