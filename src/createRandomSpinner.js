import getLatLngWithinBoundaries from './getLatLngWithinBoundaries'; 
import requestNearestPanorama from './requestNearestPanorama'; 
import tryAtMost from './tryAtMost'; 

const createRandomSpinner = function createRandomSpinner(panorama, polygon, latLngMaxMin) {

	let randomLatLng = getLatLngWithinBoundaries(latLngMaxMin, polygon);  

	tryAtMost(() => requestNearestPanorama(randomLatLng), 50, (panoRequestResults, maxTries) => {
		
		window.console.log('onCaught()'); 
		
		const { panoData, status } = panoRequestResults; 

		window.console.log("panoData:", panoData); 
		window.console.log("status:", status); 
		window.console.log("maxTries:", maxTries);

		randomLatLng = getLatLngWithinBoundaries(latLngMaxMin, polygon); 

	})

	.then(() => panorama.setPosition(randomLatLng)); 
	
}; 

export default createRandomSpinner; 
