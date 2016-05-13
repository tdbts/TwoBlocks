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
		// I changed 'vars' from an array to an object to make it make sense for how 
		// the author has used it.  
		const vars = {};
		let hash;

		// Get the string of everything after the '?' in the url, 
		// and split it into an array of parameter key/value pairs 
		const hashes = url.slice(url.indexOf('?') + 1).split('&');
		
		// For each parameter key/value pair, split the pair at the '=' 
		// character and add the key / value pair to the 'vars' object  
		for (let i = 0; i < hashes.length; i++) {
		
			hash = hashes[i].split('=');
		
			vars[hash[0]] = hash[1];
		
		} 

		return vars;
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
	const latitude = parseFloat(latlong[0]);
	const longitude = parseFloat(latlong[1]);
	
	let panoid = getUrlParameter(embedUrlParams, 'panoid');

	// #############
	// MORE SETTINGS
	// #############

	const zoom = 1.1;
	// increment controls the speed of panning
	// positive values pan to the right, negatives values pan to the left
	const increment = 1.2;
	const interval = 30;
	const chevrons = false;
	const closebutton = false;
	const clickToGo = false;
	const address = "";
	const pan = "";
	const doubleClickZoom = false;
	const imageDateControl = false;
	const scrollwheel = false;
	const zoomPos = "";
	const zoomSize = "";
	// const zoomStart = 1.1;  // Never used
	// const fullscreen = false;  // Never used

	// let fullscreenWidth;  // Never used
	// let fullscreenHeight;  // Never used
	let panorama;
	// let timer;  // Never used

	let spinner;
	let mode;  
	
	if (!(mode)) {
	
		mode = "undefined";
	
	}

	/*----------  initGl()  ----------*/
	
	const initGl = function initGl() {

		if (mode === "webgl") {

			const c = document.getElementsByTagName("canvas_streetviewpanorama").item(0);

			if (c) {

				c.addEventListener("webglcontextrestored", spinner.spin, false);
			
			}
		}
	};

	/*----------  init()  ----------*/

	const init = function init() {

		if (mode === "undefined") {

			mode = "html4";

			if (window.WebGLRenderingContext) {

				const testCanvas = document.createElement("canvas_streetviewpanorama");

				if (testCanvas) {
					//mode = "html5";
					document.getElementsByTagName("body").item(0).appendChild(testCanvas);

					const webGlNames = [
						"webgl",
						"experimental-webgl",
						"moz-webgl",
						"webkit-3d"
					];

					for (let i = 0; i < webGlNames.length; i++) {
						
						try {

							const context = testCanvas.getContext(webGlNames[i]);
						
							if (context && (typeof context.getParameter === "function")) {
								
								mode = "webgl";

								break;
							}

						} catch (e) {
							window.console.error("e:", e); 
						}
					}

					testCanvas.parentNode.removeChild(testCanvas);
				
				}
			}
		}
		
		const gps = new google.maps.LatLng(latitude, longitude);
		
		/*----------  Options Processing  ----------*/
		
		// Address control shows a box with basic information about the 
		// location, as well as a link to see the map on Google Maps 
		const addressControl = false; 

		const addressControlOptions = {
		
			position: (addressControl && address) ? address : google.maps.ControlPosition.TOP_LEFT
		
		};
		
		// Pan Control shows a UI element that allows you to rotate the pano 
		const panControl = false; 

		const panControlOptions = { 
		
			position: (panControl && pan) ? pan : google.maps.ControlPosition.TOP_LEFT 
		
		};
		
		// Zoom control functionality is obvious 
		const zoomControl = false; 

		const zoomControlOptions = {
			position: (zoomControl && zoomPos) ? zoomPos : google.maps.ControlPosition.TOP_LEFT,
			style: (zoomControl && zoomSize) ? zoomSize : google.maps.ZoomControlStyle.DEFAULT
		};
		
		/*----------  End of Options Processing  ----------*/
		
		const panoramaOptions = {
			addressControl,
			addressControlOptions,
			clickToGo,
			imageDateControl,
			mode,
			panControl,
			panControlOptions,
			scrollwheel,
			zoomControl,
			zoomControlOptions,
			disableDoubleClickZoom: !(doubleClickZoom),
			enableCloseButton: closebutton,
			linksControl: chevrons,
			pano: panoid,
			position: gps,
			pov: {
				zoom,		
				heading: 0,
				pitch: 0
			},
			visible: true
		};
		
		const canvas = document.getElementById("canvas_streetviewpanorama");

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
		
		if (canvas.onmouseover === null) {
		
			// startSpin();
			spinner.start(); 
			setTimeout(initGl, 1000);
		
		}
		
		canvas.onmouseover = () => spinner.stop();
		canvas.onmouseout = () => spinner.start();	
	};

	/*----------  showMap()  ----------*/

	/**
	 *
	 * It does not lie.  It shows the map.  
	 *
	 */
	
	const showMap = function showMap() {

		const canvas = document.getElementById("canvas_streetviewpanorama");
		
		canvas.onmouseover = function () {};
		canvas.onmouseout = function () {};
		
		// stopSpin();
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
