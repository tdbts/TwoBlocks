/* global document, google */

import injectGapiScript from './injectGapiScript';
import getLatLngMaxMin from './getLatLngMaxMin'; 
import createPanorama from './createPanorama'; 
import createSpinner from './createSpinner'; 
import randomizePanoramaLocation from './randomizePanoramaLocation';
import showChooseLocationMap from './showChooseLocationMap';  
import createWebGlManager from './createWebGlManager'; 
import { poll } from './utils/utils'; 
// import { createStore } from 'redux'; 

/*=================================
=            twoBlocks()          =
=================================*/

const twoBlocks = function twoBlocks(canvasId, locationCoordinates) {

	/*----------  Configure Redux Store  ----------*/
	
	// const configureStore = function configureStore(reducer, initialState) {

	// 	const store = createStore(
	// 		reducer, 
	// 		initialState, 
	// 		window.devToolsExtension ? window.devToolsExtension() : undefined
	// 	);

	// 	return store; 
	// }; 

	// #############
	// MORE SETTINGS
	// #############

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


	/*----------  Add Google Maps API to environment  ----------*/
	
	injectGapiScript() 

		/*----------  Poll for 'geometry' library in google.maps object  ----------*/
		
		.then(() => {

			const geometryLibraryLoaded = () => 'geometry' in google.maps; 

			const pollForGeometryLibrary = poll(geometryLibraryLoaded, 25, 3000); 

			return { pollForGeometryLibrary }; 

		})

		/*----------  Initialize panorama / spinner  ----------*/

		.then(appComponents => Object.assign({}, appComponents, init(canvas, locationCoordinates.center.lat, locationCoordinates.center.lng)))

		/*----------  Convert lat / lng values to an array of LatLng class instances  ----------*/
		
		.then(appComponents => {

			const nycBoundaryLatLngs = []; 

			const { boundaries } = locationCoordinates; 

			boundaries.forEach(pointPair => nycBoundaryLatLngs.push(new google.maps.LatLng(...pointPair))); 

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

			const nycLatLngMaxMin = getLatLngMaxMin(locationCoordinates.boundaries); 

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

						const gps = new google.maps.LatLng(locationCoordinates.center.lat, locationCoordinates.center.lng); 

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

						const calculateDistanceBetweenLatLngs = function calculateDistanceBetweenLatLngs(first, second) {
						
							return google.maps.geometry.spherical.computeDistanceBetween(first, second); 	
						
						};

						const convertMetersToMiles = function convertMetersToMiles(meters) {
						
							const MILES_PER_METER = 0.000621371; 

							return meters * MILES_PER_METER; 
						
						}; 

						google.maps.event.addListener(chooseLocationMarker, 'dragend', () => {
						
							const distanceFromPanoramaInMeters = calculateDistanceBetweenLatLngs(panorama.getPosition(), chooseLocationMarker.getPosition());

							const distanceFromPanoramaInMiles = convertMetersToMiles(distanceFromPanoramaInMeters).toFixed(3);  

							window.console.log("distanceFromPanoramaInMiles:", distanceFromPanoramaInMiles); 

						}); 

						google.maps.event.addListener(chooseLocationMap, 'click', () => {

							const distanceFromPanoramaInMeters = calculateDistanceBetweenLatLngs(panorama.getPosition(), chooseLocationMarker.getPosition()); 

							const distanceFromPanoramaInMiles = convertMetersToMiles(distanceFromPanoramaInMeters).toFixed(3); 

							window.console.log("distanceFromPanoramaInMiles:", distanceFromPanoramaInMiles);  

						}); 

					}); 

				}); 

		})

		.catch((...args) => `Caught error with args ${args}`); 

}; 

/*=====  End of twoBlocks()  ======*/


export default twoBlocks; 
