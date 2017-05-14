/* global self */

import 'babel-polyfill'; 
import { createPromiseTimeout, makeRequest, tryAtMost } from '../utils/utils'; 
import { workerMessages } from '../constants/constants';  
import RandomLocationGenerator from '../random-location-generator/RandomLocationGenerator'; 

let generator = null; 
let geoJSON = null; 

try {

	const onMessage = function onMessage(event) {

		self.postMessage(`Heard message from the DOM: ${JSON.stringify(event.data)}`); 

		return handleMessage(event.data); 

	}; 

	const handleMessage = function handleMessage(eventData) {
	
		const { message, payload } = eventData; 

		if (workerMessages.LOAD_GEO_JSON === message) {

			loadGeoJSON(payload);

		} else if (workerMessages.REQUEST_GEO_JSON === message) {

			fulfillGeoJSONRequest();
			
		} else if (workerMessages.GET_RANDOM_LOCATION === message) {

			getRandomLocation(payload);

		} 
	
	}; 

	const loadGeoJSON = function loadGeoJSON(url) {
	
		self.postMessage("Loading GeoJSON..."); 

		const MAX_LOAD_ATTEMPTS = 3; 
		const RETRY_DELAY = 1000;  // millisecons 

		tryAtMost(() => makeRequest(url), MAX_LOAD_ATTEMPTS, () => createPromiseTimeout(RETRY_DELAY))  // payload is GeoJSON source URL 

			.then(onGeoJSONLoadSuccess)

			.catch(onGeoJSONLoadError); 		
	
	}; 
	
	const onGeoJSONLoadSuccess = function onGeoJSONLoadSuccess(response) {
		
		geoJSON = JSON.parse(response.response);  

		self.postMessage({
			message: workerMessages.GEO_JSON_LOADED
		}); 
	
	};

	const onGeoJSONLoadError = function onGeoJSONLoadError() {

		self.postMessage({
			message: workerMessages.GEO_JSON_REQUEST_FAILURE
		}); 
	
	}; 

	const fulfillGeoJSONRequest = function fulfillGeoJSONRequest() {
	
		self.postMessage("Fulfilling Geo JSON request..."); 

		self.postMessage({
			message: workerMessages.SENDING_GEO_JSON, 
			payload: geoJSON
		}); 
	
	};

	const getRandomLocation = function getRandomLocation(payload) {
	
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
				latLng: randomLatLng
			}
		}); 		
	
	}; 

	self.addEventListener('message', onMessage); 

} catch (e) {

	self.postMessage("Caught an error:", e); 
	
}
