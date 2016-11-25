/* global google, L */

import { mapTypes, tileLayer, BLOCK_LEVEL_ZOOM, BOROUGH_LEVEL_ZOOM, DEFAULT_MAP_OPTIONS } from './constants/constants'; 
import createPanorama from './createPanorama'; 
import createSpinner from './createSpinner'; 
import createWebGlManager from './createWebGlManager'; 
import ChooseLocationMap from './ChooseLocationMap';  

let gameComponents = null; 

const createGameComponents = function createGameComponents(gameState) {

	if (gameComponents) return gameComponents; 

	if (!('google' in window) || !('maps' in window.google)) {

		throw new Error("The Google Maps Javascript API or one of the required libraries are not loaded on the page."); 

	}

	const { blockLevelMapCanvas, boroughLevelMapCanvas, locationData, mapCanvas, mapMarkerVisible, mobile, panoramaCanvas } = gameState; 
	
	const webGlManager = createWebGlManager(panoramaCanvas); 
	
	const mode = webGlManager.canUseWebGl() ? "webgl" : "html5";

	/*----------  Set up panorama  ----------*/

	const panorama = createPanorama(panoramaCanvas, { 
		mode, 
		position: null, 
		visible: true, 
		zoomControl: mobile
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

	const mapTypeId = mobile ? null : google.maps.MapTypeId.ROADMAP; 

	const { lat, lng } = locationData.CENTER; 

	const mapOptions = Object.assign({}, DEFAULT_MAP_OPTIONS, {
		mapTypeId,  
		center: mobile ? L.latLng(lat, lng) : { lat, lng }
	});

	const map = mobile ? new L.Map(mapCanvas, mapOptions) : new google.maps.Map(canvas, mapOptions); 

	const mapType = mobile ? mapTypes.LEAFLET : mapTypes.GOOGLE;  

	const chooseLocationMap = new ChooseLocationMap(map, mapType); 

	window.console.log("chooseLocationMap:", chooseLocationMap); 

	/*----------  Create block-level map  ----------*/
	
	const blockLevelMapOptions = Object.assign({}, DEFAULT_MAP_OPTIONS, { 
		mapTypeId,
		zoom: BLOCK_LEVEL_ZOOM 
	}); 

	const blockLevelMap = mobile ? L.map(blockLevelMapCanvas, blockLevelMapOptions) : new google.maps.Map(blockLevelMapCanvas, blockLevelMapOptions); 

	/*----------  Create borough-level map  ----------*/
	
	const boroughLevelMapOptions = Object.assign({}, DEFAULT_MAP_OPTIONS, {
		mapTypeId, 
		zoom: BOROUGH_LEVEL_ZOOM
	}); 

	const boroughLevelMap = mobile ? L.map(boroughLevelMapCanvas, boroughLevelMapOptions) : new google.maps.Map(boroughLevelMapCanvas, boroughLevelMapOptions); 			

	/*----------  Add tile layer to mobile maps  ----------*/
	
	if (mobile) {
		
		// Separate tile layers and attribution must be used 
		
		const { ATTRIBUTION, URL } = tileLayer; 

		const cityLevelTileLayer = L.tileLayer(URL, {
			attribution: ATTRIBUTION
		});			

		const boroughLevelTileLayer = L.tileLayer(URL, {
			attribution: ATTRIBUTION
		});			

		const blockLevelTileLayer = L.tileLayer(URL, {
			attribution: ATTRIBUTION
		});

		cityLevelTileLayer.addTo(chooseLocationMap.map); 
		boroughLevelTileLayer.addTo(boroughLevelMap); 
		blockLevelTileLayer.addTo(blockLevelMap);  

	}

	/*----------  Set up marker  ----------*/

	// Outside the polygon boundaries, in the Atlantic Ocean 
	const { lat: markerLat, lng: markerLng } = locationData.MARKER_PLACEMENT; 

	const markerOptions = {
		animation: google.maps.Animation.BOUNCE, 
		draggable: true, 
		map: chooseLocationMap.map, 
		position: new google.maps.LatLng(markerLat, markerLng), 
		visible: mapMarkerVisible
	}; 

	const chooseLocationMarker = mobile ? new L.Marker() : new google.maps.Marker(markerOptions); 

	/*----------  Set up WebGl  ----------*/
	
	if (webGlManager.canUseWebGl()) {

		setTimeout(() => webGlManager.initGl(), 1000);
	
	}

	// Assign game components to variable so we can just return 
	// the already-created components if we start a new game 
	gameComponents = {
		blockLevelMap, 
		boroughLevelMap, 
		chooseLocationMap, 
		chooseLocationMarker, 
		panorama, 
		spinner
	}; 

	return gameComponents; 

}; 

export default createGameComponents; 
