/* global window */

import request from 'superagent'; 
import { workerMessages } from './constants/constants'; 

const requestGeoJSON = function requestGeoJSON(url, worker) {

	let result = null; 

	/*----------  If TwoBlocks WebWorker, use it to load the GeoJSON  ----------*/
	
	if (worker) {

		/*----------  Instruct worker to load GeoJSON  ----------*/
		
		worker.postMessage({

			message: workerMessages.LOAD_GEO_JSON, 
			payload: url

		});

		result = Promise.resolve();  

	} else {

		result = request.get(url);  

	}	

	return result; 

}; 

export default requestGeoJSON; 
