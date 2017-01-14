/* global google, L */

import { mapTypes, tileLayer, BLOCK_LEVEL_ZOOM, BOROUGH_LEVEL_ZOOM, CITY_LEVEL_ZOOM, DEFAULT_MAP_OPTIONS } from '../constants/constants'; 
import createPanorama from './createPanorama'; 
import createWebGlManager from './createWebGlManager';
import Spinner from './Spinner';  
import CityMap from './CityMap';  
import ShowLocationMarker from './ShowLocationMarker'; 

let gameComponents = null; 

const createGameComponents = function createGameComponents(gameState) {

	if (gameComponents) return gameComponents;  // Create game components only once, and return them ever afterward 

	if (!('google' in window) || !('maps' in window.google)) {

		throw new Error("The Google Maps Javascript API or one of the required libraries are not loaded on the page."); 

	}

	const { maps, locationData, mobile, panorama } = gameState; 
	
	const webGlManager = createWebGlManager(panorama.element); 
	
	const mode = webGlManager.canUseWebGl() ? "webgl" : "html5";

	/*----------  Set up panorama  ----------*/

	panorama.instance = createPanorama(panorama.element, { 
		mode, 
		fullscreenControl: false, 
		position: null, 
		visible: true, 
		zoomControl: false
	}); 

	/*----------  Set up spinner  ----------*/
	
	panorama.spinner = new Spinner(panorama.instance, {
		punctuate: {
			segments: 4, 
			delay: 2000
		}
	}); 	

	panorama.spinner.on('revolution', () => window.console.log('revolution')); 
	
	/*----------  Set up cityMap  ----------*/

	const mapTypeId = mobile ? null : google.maps.MapTypeId.ROADMAP; 

	const { lat, lng } = locationData.CENTER; 

	const mapOptions = Object.assign({}, DEFAULT_MAP_OPTIONS, {
		mapTypeId,  
		center: mobile ? L.latLng(lat, lng) : { lat, lng }, 
		zoom: CITY_LEVEL_ZOOM
	});

	const map = mobile ? new L.Map(maps.city.element, mapOptions) : new google.maps.Map(maps.city.element, mapOptions); 

	const mapType = mobile ? mapTypes.LEAFLET : mapTypes.GOOGLE;  

	maps.city.instance = new CityMap(map, mapType); 

	/*----------  CITY_LEVEL_ZOOM, Create block-level map  ----------*/
	
	const blockLevelMapOptions = Object.assign({}, DEFAULT_MAP_OPTIONS, { 
		mapTypeId,
		zoom: mobile ? BLOCK_LEVEL_ZOOM - 1 : BLOCK_LEVEL_ZOOM 
	}); 

	maps.block.instance = mobile ? L.map(maps.block.element, blockLevelMapOptions) : new google.maps.Map(maps.block.element, blockLevelMapOptions); 

	/*----------  Create borough-level map  ----------*/
	
	const boroughLevelMapOptions = Object.assign({}, DEFAULT_MAP_OPTIONS, {
		mapTypeId, 
		zoom: mobile ? BOROUGH_LEVEL_ZOOM - 1 : BOROUGH_LEVEL_ZOOM
	}); 

	maps.borough.instance = mobile ? L.map(maps.borough.element, boroughLevelMapOptions) : new google.maps.Map(maps.borough.element, boroughLevelMapOptions); 			

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

		cityLevelTileLayer.addTo(maps.city.instance.map); 
		boroughLevelTileLayer.addTo(maps.borough.instance); 
		blockLevelTileLayer.addTo(maps.block.instance);  

	}

	/*----------  Set up marker  ----------*/ 

	const markerOptions = {}; 

	if (mobile) {

		markerOptions.dragging = false; 

	} else {

		markerOptions.draggable = false; 
		markerOptions.animation = google.maps.Animation.BOUNCE; 

	}

	const mapMarker = new ShowLocationMarker(markerOptions, {
		mobile, 
		blockLevelMap: maps.block.instance, 
		boroughLevelMap: maps.borough.instance
	}); 

	/*----------  Set up WebGl  ----------*/
	
	if (webGlManager.canUseWebGl()) {

		setTimeout(() => webGlManager.initGl(), 1000);
	
	}

	// Assign game components to variable so we can just return 
	// the already-created components if we start a new game 
	gameComponents = { 
		maps, 
		mapMarker, 
		panorama
	}; 

	return gameComponents; 

}; 

export default createGameComponents; 
