/* global google */

import getLatLngWithinBoundaries from './getLatLngWithinBoundaries'; 
import requestNearestPanorama from './requestNearestPanorama'; 
import getRandomFeature from './google-maps-utils/getRandomFeature'; 
import selectRandomWeightedLinearRing from './google-maps-utils/selectRandomWeightedLinearRing'; 
import getLatLngMaxMin from './getLatLngMaxMin'; 
import tryAtMost from './tryAtMost'; 

const getRandomPanoramaLocation = function getRandomPanoramaLocation(features) {

	const selectedFeature = getRandomFeature(features); 

	window.console.log("selectedFeature.getProperty('boro_name'):", selectedFeature.getProperty('boro_name')); 

	const selectedLinearRing = selectRandomWeightedLinearRing(selectedFeature); 

	const latLngMaxMin = getLatLngMaxMin(selectedLinearRing.getArray()); 

	// Data.Polygon instance must be passed an array 
	const dataPolygon = new google.maps.Data.Polygon([selectedLinearRing]); 

	const polygon = new google.maps.Polygon({
		paths: dataPolygon.getAt(0).getArray()
	}); 
	
	let randomLatLng = getLatLngWithinBoundaries(latLngMaxMin, polygon);  

	return tryAtMost(() => requestNearestPanorama(randomLatLng), 50, (panoRequestResults, maxTries) => {
		
		window.console.log('onCaught()'); 
		
		const { panoData, status } = panoRequestResults; 

		window.console.log("panoData:", panoData); 
		window.console.log("status:", status); 
		window.console.log("maxTries:", maxTries);

		randomLatLng = getLatLngWithinBoundaries(latLngMaxMin, polygon); 

	})

	.then(() => randomLatLng); 
	
}; 

export default getRandomPanoramaLocation; 
