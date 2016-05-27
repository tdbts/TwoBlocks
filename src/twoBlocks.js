/* global document, google */

import createPanorama from './createPanorama'; 
import createSpinner from './createSpinner'; 
import createWebGlManager from './createWebGlManager'; 
import selectRandomValueOfRange from './selectRandomValueOfRange'; 

/*=================================
=            twoBlocks()          =
=================================*/

const twoBlocks = function twoBlocks() {

	// #################
	// LOCATION SETTINGS
	// #################

	const latitude = 40.6291566; 
	const longitude = -74.0287341; 

	const nycBoundaryPoints = [
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
		[40.562052, -74.352036]
	]; 

	// #############
	// MORE SETTINGS
	// #############

	const canvasId = "canvas-streetviewpanorama"; 
	const canvas = document.getElementById(canvasId); 
	// 'increment' controls the speed of panning
	// positive values pan to the right, negatives values pan to the left

	const webGlManager = createWebGlManager(canvas); 

	let panoid = null; 
	let spinner;

	/*----------  init()  ----------*/

	const init = function init(canvas, latitude, longitude) {
		
		const mode = webGlManager.canUseWebGl() ? "webgl" : "html4";

		const gps = new google.maps.LatLng(latitude, longitude);

		/*----------  Set up panorama  ----------*/
		
		const panorama = createPanorama(canvas, { 
			mode, 
			pano: panoid, 
			position: gps
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
			punctuate: {
				segments: 4, 
				delay: 2000
			}
		}); 
		
		spinner.start(); 

		canvas.addEventListener('mouseover', () => spinner.stop()); 
		canvas.addEventListener('mouseout', () => spinner.start()); 

		webGlManager.on('webglcontextrestored', () => spinner.spin()); 
		
		/*----------  Set up WebGl  ----------*/
		
		if (webGlManager.canUseWebGl()) {

			setTimeout(() => webGlManager.initGl(), 1000);
		
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
		
		const map = new google.maps.Map(canvas, mapOptions);
		
		// Add a marker to the map.  Options define which map, 
		// what location, and whether is visible.  
		const markerOptions = {
			map,
			position: mapOptions.center,
			visible: true
		};
		
		const marker = new google.maps.Marker(markerOptions);
		
		google.maps.event.addListener(marker, 'click', () => init(canvas, latitude, longitude));
		
	};

	/*----------  injectGapiScript()  ----------*/
	
	const injectGapiScript = function injectGapiScript(MAPS_API_KEY) {

		return new Promise(resolve => {

			const script = document.createElement("script");
			
			let source = "https://maps.googleapis.com/maps/api/js"; 
			
			script.type = "text/javascript";
			
			if (MAPS_API_KEY) {
				
				source += `&key=${MAPS_API_KEY}`;
			
			}

			script.src = source; 
			script.onload = () => resolve(); 

			document.body.appendChild(script);

		}); 
	
	};

	/*----------  Initialization  ----------*/
	
	injectGapiScript() 

		.then(() => init(canvas, latitude, longitude))

		// Convert array of lat / lng values to an array 
		// of LatLng class instances 
		.then(() => {

			const nycBoundaryLatLngs = []; 

			nycBoundaryPoints.forEach(pointPair => {

				nycBoundaryLatLngs.push(new google.maps.LatLng(...pointPair)); 

			}); 

			return nycBoundaryLatLngs; 

		})

		// Create nycPolygon using the array of LatLng instances 
		.then(nycBoundaryLatLngs => {

			const nycPolygon = new google.maps.Polygon({

				paths: nycBoundaryLatLngs
			
			}); 

			window.console.log("nycPolygon:", nycPolygon);

			return nycPolygon; 

		})

		// Create an object defining the min / max values 
		// for both lat / lng of the NYC boundary points 
		.then(nycPolygon => {

			let latLngMaxMin = {
				lat: { 
					min: null, 
					max: null 
				}, 
				
				lng: {
					min: null, 
					max: null
				} 				
			}; 

			latLngMaxMin = nycBoundaryPoints.reduce((prev, curr, i) => {
 
				const { lat, lng } = prev; 

				// On the first invocation, the Lat and Lng 
				// values are both the min and max 
				if (i === 0) {

					const [ currLat, currLng ] = curr; 

					lat.min = lat.max = currLat; 
					lng.min = lng.max = currLng; 

				} else {

					const [ currLat, currLng ] = curr; 

					lat.min = Math.min(lat.min, currLat); 
					lat.max = Math.max(lat.max, currLat); 
					lng.min = Math.min(lng.min, currLng); 
					lng.max = Math.max(lng.max, currLng); 

				}

				return prev; 

			}, latLngMaxMin); 

			window.console.log("latLngMaxMin:", latLngMaxMin); 

			return { latLngMaxMin, nycPolygon }; 

		})

		// Select random point from within min / max values for 
		// lat / lng, and check if they fall within our defined 
		// NYC polygon 
		.then(nycMapData => {

			return new Promise(resolve => {

				const { latLngMaxMin, nycPolygon } = nycMapData; 
				
				const getRandomNycCoords = function getRandomNycCoords(latLngMaxMin, selectRandomValueOfRange) {
				
					const { lat, lng } = latLngMaxMin; 

					const randomLat = selectRandomValueOfRange(lat.min, lat.max).toFixed(6); 
					
					const randomLng = selectRandomValueOfRange(lng.min, lng.max).toFixed(6); 

					window.console.log("randomLat:", randomLat); 
					window.console.log("randomLng:", randomLng); 

					const randomCoords = { randomLat, randomLng }; 
					
					return randomCoords; 
				
				}; 

				// Umm...Have to put a timeout, or else the 'geometry' library is not defined 
				// yet on the google.maps object.  WTF Google. 
				setTimeout(function() {
					
					const { randomLat, randomLng } = getRandomNycCoords(latLngMaxMin, selectRandomValueOfRange); 

					const randomLatLng = new google.maps.LatLng(randomLat, randomLng); 

					const isWithinNycBoundaries = google.maps.geometry.poly.containsLocation(randomLatLng, nycPolygon); 

					window.console.log("isWithinNycBoundaries:", isWithinNycBoundaries); 
					
					resolve({ getRandomNycCoords, latLngMaxMin, nycPolygon }); 

				}, 1000);

			}) 

			.then(nycMapData => {

				const { getRandomNycCoords, latLngMaxMin, nycPolygon } = nycMapData; 

				const createRandomNycSpinner = function createRandomNycSpinner(getRandomNycCoords, latLngMaxMin, nycPolygon) {
				
					let isWithinNycBoundaries = false; 
					let randomCoords = null;
					let randomLatLng;  

					while (!(isWithinNycBoundaries)) {

						randomCoords = getRandomNycCoords(latLngMaxMin, selectRandomValueOfRange); 
						
						const { randomLat, randomLng } = randomCoords; 

						randomLatLng = new google.maps.LatLng(randomLat, randomLng); 

						isWithinNycBoundaries = google.maps.geometry.poly.containsLocation(randomLatLng, nycPolygon); 

					}

					// return init(canvas, randomLat, randomLng);
					if (spinner) {

						spinner.stop();  
					
					}

					const panorama = createPanorama(canvas, { 
						mode: "webgl", 
						position: randomLatLng
					}); 					
				
					spinner = createSpinner(panorama, {
						punctuate: {
							segments: 4, 
							delay: 2000
						}
					}); 	
					
					spinner.start(); 				

				}; 

				setInterval(() => createRandomNycSpinner(getRandomNycCoords, latLngMaxMin, nycPolygon), 10000); 

			}); 

		}); 

}; 

/*=====  End of twoBlocks()  ======*/


export default twoBlocks; 
