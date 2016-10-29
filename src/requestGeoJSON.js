/* global window */

import request from 'superagent'; 
import { events, workerMessages } from './constants/constants'; 

const requestGeoJSON = function requestGeoJSON(url, worker) {

	// const onGeoJSONReceived = geoJSON => {

	// 	if (!(geoJSON)) {

	// 		throw new Error("No GeoJSON returned from the request for location data."); 

	// 	}
	// 	window.console.log("events.GEO_JSON_LOADED"); 
	// 	gameInstance.emit(events.GEO_JSON_LOADED, geoJSON); 

	// }; 

	/*----------  If TwoBlocks WebWorker, use it to load the GeoJSON  ----------*/
	
	if (worker) {

		// const geoJSONTransmissionListener = e => {

		// 	window.console.log("e:", e); 

		// 	const eventData = e.data; 

		// 	const { message, payload } = eventData; 

		// 	if (workerMessages.GEO_JSON_LOADED === message) {

		// 		worker.postMessage({
		// 			message: workerMessages.REQUEST_GEO_JSON, 
		// 			payload: null
		// 		}); 

		// 	} 
			// else if (workerMessages.SENDING_GEO_JSON === message) {

			// 	onGeoJSONReceived(payload); 

			// 	worker.removeEventListener('message', geoJSONTransmissionListener); 

			// }

		// }; 

		// Add listener before posting message to worker 
		// worker.addEventListener('message', geoJSONTransmissionListener); 

		/*----------  Instruct worker to load GeoJSON  ----------*/
		
		return worker.postMessage({

			message: workerMessages.LOAD_GEO_JSON, 
			payload: url

		}); 

	} else {

		return request.get(url)

			.then(response => onGeoJSONReceived(response.body)); 

	}	

}; 

export default requestGeoJSON; 

