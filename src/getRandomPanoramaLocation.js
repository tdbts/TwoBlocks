/* global google */

import getLatLngWithinBoundaries from './getLatLngWithinBoundaries'; 
import requestNearestPanorama from './requestNearestPanorama'; 
import getRandomFeature from './getRandomFeature'; 
import selectRandomWeightedLinearRing from './selectRandomWeightedLinearRing'; 
import getLatLngMaxMin from './getLatLngMaxMin'; 
import { tryAtMost } from './utils/utils'; 

const getRandomPanoramaLocation = function getRandomPanoramaLocation(featureCollection) {

	const selectedFeature = getRandomFeature(featureCollection); 

	window.console.log("selectedFeature.getProperty('boro_name'):", selectedFeature.getProperty('boro_name')); 

	const selectedLinearRing = selectRandomWeightedLinearRing(selectedFeature); 

	const latLngMaxMin = getLatLngMaxMin(selectedLinearRing.getArray()); 

	// Data.Polygon instance must be passed an array 
	const dataPolygon = new google.maps.Data.Polygon([selectedLinearRing]); 

	const polygon = new google.maps.Polygon({
		paths: dataPolygon.getAt(0).getArray()
	}); 
	
	let randomLatLng = getLatLngWithinBoundaries(latLngMaxMin, polygon);  

	return tryAtMost(() => requestNearestPanorama(randomLatLng), 50, (panoRequestResults, requestAttemptsLeft) => {
		
		window.console.log('onCaught()'); 
		
		const { panoData, status } = panoRequestResults; 

		window.console.log("panoData:", panoData); 
		window.console.log("status:", status); 
		window.console.log("requestAttemptsLeft:", requestAttemptsLeft);

		randomLatLng = getLatLngWithinBoundaries(latLngMaxMin, polygon); 

	})

	.then(() => randomLatLng); 
	
}; 

export default getRandomPanoramaLocation; 
