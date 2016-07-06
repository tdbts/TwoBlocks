import getLatLngWithinBoundaries from './getLatLngWithinBoundaries'; 
import requestNearestPanorama from './requestNearestPanorama'; 
import tryAtMost from './tryAtMost'; 

const getRandomPanoramaLocation = function getRandomPanoramaLocation(polygon, latLngMaxMin) {

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
