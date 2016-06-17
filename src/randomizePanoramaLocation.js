import getLatLngWithinBoundaries from './getLatLngWithinBoundaries'; 
import requestNearestPanorama from './requestNearestPanorama'; 
import tryAtMost from './tryAtMost'; 

const randomizePanoramaLocation = function randomizePanoramaLocation(panorama, polygon, latLngMaxMin) {

	let randomLatLng = getLatLngWithinBoundaries(latLngMaxMin, polygon);  

	return tryAtMost(() => requestNearestPanorama(randomLatLng), 50, (panoRequestResults, maxTries) => {
		
		window.console.log('onCaught()'); 
		
		const { panoData, status } = panoRequestResults; 

		window.console.log("panoData:", panoData); 
		window.console.log("status:", status); 
		window.console.log("maxTries:", maxTries);

		randomLatLng = getLatLngWithinBoundaries(latLngMaxMin, polygon); 

	})

	.then(() => panorama.setPosition(randomLatLng)); 
	
}; 

export default randomizePanoramaLocation; 