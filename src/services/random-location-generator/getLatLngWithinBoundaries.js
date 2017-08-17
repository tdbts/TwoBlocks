import turf from '@turf/turf';
import getRandomCoords from './getRandomCoords'; 

const getLatLngWithinBoundaries = function getLatLngWithinBoundaries(latLngMaxMin, polygon) {

	let isWithinBoundaries = false; 
	let randomLatLng = null; 

	// Until we find coordinates within our predefined region...
	while (!(isWithinBoundaries)) {

		const randomCoords = getRandomCoords(latLngMaxMin); 
		
		const { randomLat, randomLng } = randomCoords; 

		// const pointCoords = [parseFloat(randomLat), parseFloat(randomLng)];
		const pointCoords = [parseFloat(randomLng), parseFloat(randomLat)];

		randomLatLng = turf.point(pointCoords); 

		// Check that the random coords are within polygon
		isWithinBoundaries = turf.inside(randomLatLng, polygon); 
 
	}

	return randomLatLng; 

};

export default getLatLngWithinBoundaries; 
