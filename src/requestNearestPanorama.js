/* global google, window */

const requestNearestPanorama = function requestNearestPanorama(randomLatLng) {
	window.console.log("requestNearestPanorama()");
	window.console.log("randomLatLng:", randomLatLng);  
	return new Promise((resolve, reject) => {

		const streetViewService = new google.maps.StreetViewService(); 

		const { coordinates } = randomLatLng.geometry; 
		window.console.log("coordinates:", coordinates); 
		// const [ lat, lng ] = coordinates; 
		const [ lng, lat ] = coordinates; 

		const location = { lat, lng };  

		const locationRequest = {
			location, 
			preference: google.maps.StreetViewPreference.NEAREST
		}; 

		streetViewService.getPanorama(locationRequest, (panoData, status) => {
			
			window.console.log("panoData:", panoData); 
			window.console.log("status:", status); 

			if ('OK' === status) {

				resolve({ panoData, status });

			} else {
				window.console.log("requestNearestPanorama() -- Rejecting...")
				reject({ panoData, status }); 
			
			} 
		
		});  
	
	}); 

};

export default requestNearestPanorama; 
