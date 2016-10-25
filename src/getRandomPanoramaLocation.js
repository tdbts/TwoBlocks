/* global google */

import turf from '@turf/turf'; 
import getLatLngWithinBoundaries from './getLatLngWithinBoundaries'; 
import requestNearestPanorama from './requestNearestPanorama'; 
import createFeatureCollection from './geoJSON-utils/createFeatureCollection'; 
import getRandomFeature from './getRandomFeature'; 
import selectRandomWeightedLinearRing from './selectRandomWeightedLinearRing'; 
import getLatLngMaxMin from './getLatLngMaxMin'; 
import pointToLatLngLiteral from './pointToLatLngLiteral'; 
import { tryAtMost } from './utils/utils';
import { MAXIMUM_PANORAMA_REQUESTS } from './constants/constants';  

const getRandomPanoramaLocation = function getRandomPanoramaLocation(featureCollection) {
 
	const selectedBorough = getRandomFeature(featureCollection); 

	// const boroughName = selectedBorough.getProperty('boro_name'); 
	const boroughName = selectedBorough.properties.boro_name; 

	const selectedLinearRing = selectRandomWeightedLinearRing(selectedBorough); 
 
	const latLngMaxMin = getLatLngMaxMin(selectedLinearRing); 

	const polygon = turf.polygon([selectedLinearRing]); 
	
	polygon.geometry.coordinates[0] = polygon.geometry.coordinates[0].map(coords => {

		return [coords[1], coords[0]]; 

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

	.then(() => (randomLatLng = (pointToLatLngLiteral(randomLatLng))))

	// N.B - Parentheses must be wrapped around an object literal 
	// returned by an arrow function
	.then(() => ( { boroughName, randomLatLng, selectedBorough } ));	

}; 

export default getRandomPanoramaLocation; 
