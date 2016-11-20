/* global window */

import request from 'superagent'; 
import { events, workerMessages } from './constants/constants'; 

const requestGeoJSON = function requestGeoJSON(url, gameInstance, worker) {

	/*----------  If TwoBlocks WebWorker, use it to load the GeoJSON  ----------*/
	
	if (worker) {

		/*----------  Instruct worker to load GeoJSON  ----------*/
		
		return worker.postMessage({

			message: workerMessages.LOAD_GEO_JSON, 
			payload: url

		}); 

	} else {

		return request.get(url)

			.then(response => gameInstance.emit(events.GEO_JSON_LOADED, response.body)); 

	}	

}; 

export default requestGeoJSON; 
