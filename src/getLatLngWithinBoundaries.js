/* global google */

import getRandomCoords from './getRandomCoords'; 

const getLatLngWithinBoundaries = function getLatLngWithinBoundaries(latLngMaxMin, polygon) {

	let isWithinBoundaries = false; 
	let randomLatLng = null; 

	// Until we find coordinates within our predefined region...
	while (!(isWithinBoundaries)) {

		const randomCoords = getRandomCoords(latLngMaxMin); 
		
		const { randomLat, randomLng } = randomCoords; 

		randomLatLng = new google.maps.LatLng(randomLat, randomLng); 

		// Check that the random coords are within polygon
		isWithinBoundaries = google.maps.geometry.poly.containsLocation(randomLatLng, polygon); 

	}

	return randomLatLng; 

};

export default getLatLngWithinBoundaries; 
