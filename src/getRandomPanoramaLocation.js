/* global google */

import getLatLngWithinBoundaries from './getLatLngWithinBoundaries'; 
import requestNearestPanorama from './requestNearestPanorama'; 
import getRandomFeature from './getRandomFeature'; 
import selectRandomWeightedLinearRing from './selectRandomWeightedLinearRing'; 
import getLatLngMaxMin from './getLatLngMaxMin'; 
import { tryAtMost } from './utils/utils';
import { MAXIMUM_PANORAMA_REQUESTS } from './constants/constants';  

const getRandomPanoramaLocation = function getRandomPanoramaLocation(featureCollection) {
 
	const selectedBorough = getRandomFeature(featureCollection); 

	const boroughName = selectedBorough.getProperty('boro_name'); 

	const selectedLinearRing = selectRandomWeightedLinearRing(selectedBorough); 

	const latLngMaxMin = getLatLngMaxMin(selectedLinearRing.getArray()); 

	// Data.Polygon instance must be passed an array 
	const dataPolygon = new google.maps.Data.Polygon([selectedLinearRing]); 

	const polygon = new google.maps.Polygon({
		paths: dataPolygon.getAt(0).getArray()
	}); 
	
	let randomLatLng = getLatLngWithinBoundaries(latLngMaxMin, polygon);  

	return tryAtMost(() => requestNearestPanorama(randomLatLng), MAXIMUM_PANORAMA_REQUESTS, (panoRequestResults, requestAttemptsLeft) => {
		
		window.console.log('onCaught()'); 
		
		const { panoData, status } = panoRequestResults; 

		window.console.log("panoData:", panoData); 
		window.console.log("status:", status); 
		window.console.log("requestAttemptsLeft:", requestAttemptsLeft);

		randomLatLng = getLatLngWithinBoundaries(latLngMaxMin, polygon); 

	})

	// N.B - Parentheses must be wrapped around an object literal 
	// returned by an arrow function
	.then(() => ( { boroughName, randomLatLng, selectedBorough } ));	

}; 

export default getRandomPanoramaLocation; 
