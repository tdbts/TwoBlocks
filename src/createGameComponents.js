/* global google */

import createPanorama from './createPanorama'; 
import createSpinner from './createSpinner'; 
import createWebGlManager from './createWebGlManager'; 
import getLatLngMaxMin from './getLatLngMaxMin'; 

const createGameComponents = function createGameComponents(gameState) {

	if (!('google' in window) || !('maps' in window.google) || !('geometry' in window.google.maps)) {

		throw new Error("The Google Maps Javascript API or one of the required libraries are not loaded on the page."); 

	}

	const { canvas, currentLat, currentLng, locationData } = gameState; 
	const webGlManager = createWebGlManager(canvas); 
	const mode = webGlManager.canUseWebGl() ? "webgl" : "html5";

	const gps = new google.maps.LatLng(currentLat, currentLng);	

	/*----------  Set up panorama  ----------*/

	const panorama = createPanorama(canvas, { 
		mode, 
		position: gps, 
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
	
	/*----------  Set up WebGl  ----------*/
	
	if (webGlManager.canUseWebGl()) {

		setTimeout(() => webGlManager.initGl(), 1000);
	
	}

	/*----------  Convert lat / lng values to an array of LatLng class instances  ----------*/

	const nycBoundaryLatLngs = []; 

	const { boundaries } = locationData; 

	boundaries.forEach(pointPair => nycBoundaryLatLngs.push(new google.maps.LatLng(...pointPair))); 		

	/*----------  Create nycPolygon using the array of LatLng instances  ----------*/

	const nycPolygon = new google.maps.Polygon({

		paths: nycBoundaryLatLngs
	
	}); 

	window.console.log("nycPolygon:", nycPolygon);		

	/*----------  Create an object defining the min / max values for lat / lng of the NYC boundary  ----------*/	

	const nycLatLngMaxMin = getLatLngMaxMin(boundaries); 

	window.console.log("nycLatLngMaxMin:", nycLatLngMaxMin); 

	return {
		nycBoundaryLatLngs, 
		nycLatLngMaxMin, 
		nycPolygon, 
		panorama, 
		spinner
	}; 

}; 

export default createGameComponents; 
