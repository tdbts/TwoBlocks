/* global self */

import 'babel-polyfill'; 
import { makeRequest } from '../utils/utils'; 
import { workerMessages } from '../constants/constants'; 
// import pointToLatLngLiteral from '../pointToLatLngLiteral'; 
import RandomLocationGenerator from '../RandomLocationGenerator'; 

let generator = null; 
let geoJSON = null; 

try {

	const onMessage = function onMessage(event) {

		const eventData = event.data; 

		self.postMessage(`Heard message from the DOM: ${JSON.stringify(eventData)}`); 

		return handleMessage(eventData); 

	}; 

	const handleMessage = function handleMessage(eventData) {
	
		const { message, payload } = eventData; 

		if (workerMessages.LOAD_GEO_JSON === message) {

			self.postMessage("Loading GeoJSON..."); 

			return makeRequest(payload)  // payload is GeoJSON source URL 

				.then(response => {

					geoJSON = JSON.parse(response.response);  

					self.postMessage({
						message: workerMessages.GEO_JSON_LOADED
					}); 

				}); 

		} else if (workerMessages.REQUEST_GEO_JSON === message) {

			self.postMessage("Fulfilling Geo JSON request..."); 

			self.postMessage({
				message: workerMessages.SENDING_GEO_JSON, 
				payload: geoJSON
			}); 
			
		} else if (workerMessages.GET_RANDOM_LOCATION === message) {

			self.postMessage("Getting random location..."); 

			const { newTurn } = payload; 

			if (newTurn || (!(generator))) {

				generator = new RandomLocationGenerator(geoJSON); 

			}

			const randomLatLng = generator.randomLatLng(); 

			const { selectedBorough } = generator;  

			self.postMessage({
				message: workerMessages.RANDOM_LOCATION_CHOSEN, 
				payload: {
					selectedBorough, 
					boroughName: selectedBorough.properties.boro_name,  
					// latLng: pointToLatLngLiteral(randomLatLng)
					latLng: randomLatLng
				}
			}); 

		} 
	
	}; 
	

	self.addEventListener('message', onMessage); 

} catch (e) {

	self.postMessage("Caught an error:", e); 
	
}
