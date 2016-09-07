/* global google */

import createPanorama from './createPanorama'; 
import createSpinner from './createSpinner'; 
import createWebGlManager from './createWebGlManager'; 
import createChooseLocationMap from './createChooseLocationMap'; 

let gameComponents = null; 

const createGameComponents = function createGameComponents(gameState) {

	if (gameComponents) return gameComponents; 

	if (!('google' in window) || !('maps' in window.google) || !('geometry' in window.google.maps)) {

		throw new Error("The Google Maps Javascript API or one of the required libraries are not loaded on the page."); 

	}

	const { locationData, mapCanvas, mapMarkerVisible, panoramaCanvas } = gameState; 
	
	const webGlManager = createWebGlManager(panoramaCanvas); 
	
	const mode = webGlManager.canUseWebGl() ? "webgl" : "html5";

	/*----------  Set up panorama  ----------*/

	const panorama = createPanorama(panoramaCanvas, { 
		mode, 
		position: null, 
		visible: true
	}); 

	/*----------  Set up spinner  ----------*/
	
	const spinner = createSpinner(panorama, {
		punctuate: {
			segments: 4, 
			delay: 2000
		}
	}); 	

	spinner.on('revolution', () => window.console.log('revolution')); 
	
	/*----------  Set up chooseLocationMap  ----------*/

	const DEFAULT_LAT = 40.6291566; 
	const DEFAULT_LNG = -74.0287341; 

	const mapOptions = {
		center: new google.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG),  
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}; 

	const chooseLocationMap = createChooseLocationMap(mapCanvas, mapOptions);	

	// window.console.log("chooseLocationMap:", chooseLocationMap); 		

	/*----------  Set up marker  ----------*/

	// Outside the polygon boundaries, in the Atlantic Ocean 
	const { lat: markerLat, lng: markerLng } = locationData.MARKER_PLACEMENT; 

	const markerOptions = {
		animation: google.maps.Animation.BOUNCE, 
		draggable: true, 
		map: chooseLocationMap, 
		position: new google.maps.LatLng(markerLat, markerLng), 
		visible: mapMarkerVisible
	}; 

	const chooseLocationMarker = new google.maps.Marker(markerOptions); 

	// Stop bouncing 
	google.maps.event.addListener(chooseLocationMarker, 'dragstart', () => chooseLocationMarker.setAnimation(null)); 

	google.maps.event.addListener(chooseLocationMap, 'click', e => {

		const { latLng } = e; 

		chooseLocationMarker.setPosition(latLng); 
		chooseLocationMarker.setAnimation(null); 

	});

	/*----------  Set up WebGl  ----------*/
	
	if (webGlManager.canUseWebGl()) {

		setTimeout(() => webGlManager.initGl(), 1000);
	
	}

	// Assign game components to variable so we can just return 
	// the already-created components if we start a new game 
	gameComponents = {
		chooseLocationMap, 
		chooseLocationMarker, 
		panorama, 
		spinner
	}; 

	return gameComponents; 

}; 

export default createGameComponents; 
