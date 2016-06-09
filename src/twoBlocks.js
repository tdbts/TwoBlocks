/* global document, google */

import injectGapiScript from './injectGapiScript';
import getLatLngMaxMin from './getLatLngMaxMin'; 
import createPanorama from './createPanorama'; 
import createSpinner from './createSpinner'; 
import randomizePanoramaLocation from './randomizePanoramaLocation';
import showChooseLocationMap from './showChooseLocationMap';  
import createWebGlManager from './createWebGlManager'; 
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

	const webGlManager = createWebGlManager(canvas); 

	let spinner;

	/*----------  init()  ----------*/

	const init = function init(canvas, latitude, longitude) {
		
		const mode = webGlManager.canUseWebGl() ? "webgl" : "html5";

		const gps = new google.maps.LatLng(latitude, longitude);

		/*----------  Set up panorama  ----------*/
		
		const panorama = createPanorama(canvas, { 
			mode, 
			position: gps, 
			visible: false
		}); 
	
		const mapOptions = {
			center: gps,
			zoom: 11,
			mapTypeId: google.maps.MapTypeId.ROADMAP 
		};	 

		google.maps.event.addListener(panorama, 'closeclick', () => showMap(canvas, mapOptions));

		/*----------  Set up spinner  ----------*/
		
		spinner = createSpinner(panorama, {
			punctuate: {
				segments: 4, 
				delay: 2000
			}
		}); 

		spinner.on('revolution', () => window.console.log('revolution')); 
		
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

			nycBoundaryPoints.forEach(pointPair => nycBoundaryLatLngs.push(new google.maps.LatLng(...pointPair))); 

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

			const nycLatLngMaxMin = getLatLngMaxMin(nycBoundaryPoints); 

			window.console.log("nycLatLngMaxMin:", nycLatLngMaxMin); 

			return Object.assign({}, appComponents, { nycLatLngMaxMin }); 

		})

		.then(appComponents => {

			window.console.log("appComponents:", appComponents); 

			const { 
				
				nycBoundaryLatLngs, 
				nycLatLngMaxMin,
				nycPolygon,
				panorama,  
				pollForGeometryLibrary, 
				spinner 

			} = appComponents; 

			pollForGeometryLibrary 

				.then(() => randomizePanoramaLocation(panorama, nycPolygon, nycLatLngMaxMin)) 

				.then(() => {

					panorama.setVisible(true); 

					spinner.start(); 

					spinner.once('revolution', () => {
					
						spinner.stop(); 

						const gps = new google.maps.LatLng(latitude, longitude); 

						const mapOptions = {
							center: gps
						}; 

						const chooseLocationMap = showChooseLocationMap(canvas, nycBoundaryLatLngs, mapOptions);

						// Outside the polygon boundaries, in the Atlantic Ocean 
						const markerLat = 40.480993; 
						const markerLng = -73.72798; 

						const markerOptions = {
							animation: google.maps.Animation.BOUNCE, 
							draggable: true, 
							map: chooseLocationMap, 
							position: new google.maps.LatLng(markerLat, markerLng)
						}; 

						const chooseLocationMarker = new google.maps.Marker(markerOptions); 

						google.maps.event.addListener(chooseLocationMarker, 'dragstart', () => chooseLocationMarker.setAnimation(null)); 

						google.maps.event.addListener(chooseLocationMap, 'click', e => {

							const { latLng } = e; 

							chooseLocationMarker.setPosition(latLng); 
							chooseLocationMarker.setAnimation(null); 

						});

					}); 

				}); 

		})

		.catch((...args) => `Caught error with args ${args}`); 

}; 

/*=====  End of twoBlocks()  ======*/


export default twoBlocks; 
