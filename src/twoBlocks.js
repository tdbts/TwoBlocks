/* global document, google */

import createPanorama from './createPanorama'; 
import createSpinner from './createSpinner'; 
import createWebGlManager from './createWebGlManager'; 
import selectRandomValueOfRange from './selectRandomValueOfRange';
import tryAtMost from './tryAtMost'; 
import { poll } from './utils/utils'; 

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

		spinner.on('revolution', () => window.console.log('revolution')); 
		
		spinner.start(); 

		canvas.addEventListener('mouseover', () => spinner.stop()); 
		canvas.addEventListener('mouseout', () => spinner.start()); 

		webGlManager.on('webglcontextrestored', () => spinner.spin()); 
		
		/*----------  Set up WebGl  ----------*/
		
		if (webGlManager.canUseWebGl()) {

			setTimeout(() => webGlManager.initGl(), 1000);
		
		}

		return { panorama, spinner }; 
		
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

	/*----------  Add Google Maps API to environment  ----------*/
	
	injectGapiScript() 

		/*----------  Poll for 'geometry' library in google.maps object  ----------*/
		
		.then(() => {

			const geometryLibraryLoaded = () => 'geometry' in google.maps; 

			const pollForGeometryLibrary = poll(geometryLibraryLoaded, 25, 3000); 

			return { pollForGeometryLibrary }; 

		})

		/*----------  Initialize panorama / spinner  ----------*/

		.then(appComponents => Object.assign({}, appComponents, init(canvas, latitude, longitude)))

		/*----------  Convert lat / lng values to an array of LatLng class instances  ----------*/
		
		.then(appComponents => {

			const nycBoundaryLatLngs = []; 

			nycBoundaryPoints.forEach(pointPair => {

				nycBoundaryLatLngs.push(new google.maps.LatLng(...pointPair)); 

			}); 

			return Object.assign({}, appComponents, { nycBoundaryLatLngs }); 

		})

		/*----------  Create nycPolygon using the array of LatLng instances  ----------*/
		
		.then(appComponents => {

			const { nycBoundaryLatLngs } = appComponents; 

			const nycPolygon = new google.maps.Polygon({

				paths: nycBoundaryLatLngs
			
			}); 

			window.console.log("nycPolygon:", nycPolygon);

			return Object.assign({}, appComponents, { nycPolygon }); 

		})

		/*----------  Create an object defining the min / max values for lat / lng of the NYC boundary  ----------*/
		
		.then(appComponents => {

			const { nycPolygon } = appComponents; 

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

			return Object.assign({}, appComponents, { latLngMaxMin, nycPolygon }); 

		})

		/*----------  Select random point from within min / max lat / lng range and check if the point falls within our NYC polygon  ----------*/
		
		.then(appComponents => {

			const getRandomNycCoords = function getRandomNycCoords(latLngMaxMin, selectRandomValueOfRange) {
			
				const { lat, lng } = latLngMaxMin; 

				const randomLat = selectRandomValueOfRange(lat.min, lat.max).toFixed(6); 
				
				const randomLng = selectRandomValueOfRange(lng.min, lng.max).toFixed(6); 

				window.console.log("randomLat:", randomLat); 
				window.console.log("randomLng:", randomLng); 

				const randomCoords = { randomLat, randomLng }; 
				
				return randomCoords; 
			
			}; 
			

			return Object.assign({}, appComponents, { getRandomNycCoords }); 

		}) 

		.then(appComponents => {

			const { getRandomNycCoords, latLngMaxMin } = appComponents; 

			const getLatLngWithinBoundaries = function getLatLngWithinBoundaries(nycPolygon) {
			
				let isWithinNycBoundaries = false; 
				let randomLatLng = null; 

				// Until we find coordinates within our predefined region...
				while (!(isWithinNycBoundaries)) {

					// 'randomCoords' is the result of getRandomNycCoords() 
					const randomCoords = getRandomNycCoords(latLngMaxMin, selectRandomValueOfRange); 
					
					const { randomLat, randomLng } = randomCoords; 

					randomLatLng = new google.maps.LatLng(randomLat, randomLng); 

					// Check that the random coords are within polygon
					isWithinNycBoundaries = google.maps.geometry.poly.containsLocation(randomLatLng, nycPolygon); 

				}

				return randomLatLng; 
			
			}; 

			return Object.assign({}, appComponents, { getLatLngWithinBoundaries }); 			

		})

		.then(appComponents => {

			const requestNearestPanorama = function requestNearestPanorama(randomLatLng) {
			
				return new Promise((resolve, reject) => {

					const streetViewService = new google.maps.StreetViewService(); 

					const locationRequest = {
						location: randomLatLng, 
						preference: google.maps.StreetViewPreference.NEAREST
					}; 

					streetViewService.getPanorama(locationRequest, (panoData, status) => {
						
						window.console.log("panoData:", panoData); 
						window.console.log("status:", status); 

						if ('OK' === status) {

							resolve({ panoData, status });

						} else {

							reject({ panoData, status }); 
						
						} 
					
					});  
				
				}); 
			
			};

			return Object.assign({}, appComponents, { requestNearestPanorama }); 

		})

		.then(appComponents => {

				window.console.log("appComponents:", appComponents); 

				const { getLatLngWithinBoundaries, requestNearestPanorama } = appComponents; 

				// createRandomNycSpinner() could be generalized to createRandomSpinner(), with the polygon 
				// determining the area within which to look for panoramas.  This means that we could ultimately 
				// generalize this to apply to any city, not just NYC.  
				const createRandomNycSpinner = function createRandomNycSpinner(panorama, nycPolygon) {
				
					let randomLatLng = getLatLngWithinBoundaries(nycPolygon);  

					tryAtMost(() => requestNearestPanorama(randomLatLng), 50, (panoRequestResults, maxTries) => {
						
						window.console.log('onCaught()'); 
						
						const { panoData, status } = panoRequestResults; 

						window.console.log("panoData:", panoData); 
						window.console.log("status:", status); 
						window.console.log("maxTries:", maxTries);

						randomLatLng = getLatLngWithinBoundaries(nycPolygon); 

					})

					.then(() => panorama.setPosition(randomLatLng)); 
					
				}; 

				return Object.assign({}, appComponents, { createRandomNycSpinner }); 

		})

		.then(appComponents => {

			const { 
			
				createRandomNycSpinner,  
				nycPolygon,
				panorama,  
				pollForGeometryLibrary, 
				spinner 

			} = appComponents; 

			pollForGeometryLibrary 

				.then(spinner.on('revolution', () => createRandomNycSpinner(panorama, nycPolygon)));  

		})

		.catch((...args) => `Caught error with args ${args}`); 

}; 

/*=====  End of twoBlocks()  ======*/


export default twoBlocks; 
