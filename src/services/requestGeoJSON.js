/* global window */

import request from 'superagent'; 
import { workerMessages } from '../constants/constants'; 

const requestGeoJSON = function requestGeoJSON(url, worker) {

	let result = null; 

	/*----------  If TwoBlocks WebWorker, use it to load the GeoJSON  ----------*/
	
	if (worker) {

		result = new Promise((resolve, reject) => {

			worker.addEventListener('message', event => {

				const { message } = event.data; 

				if (workerMessages.GEO_JSON_LOADED === message) {

					resolve(); 

				} else if (workerMessages.GEO_JSON_REQUEST_FAILURE === message) {

					reject(new Error("Failure to load GeoJSON data.  Check your internet connection.")); 

				}

			});  

		}); 

		/*----------  Instruct worker to load GeoJSON  ----------*/
		
		worker.postMessage({

			message: workerMessages.LOAD_GEO_JSON, 
			payload: url

		});  

	} else {

		result = request.get(url)

			.then(response => response.body);

	}	

	return result; 

}; 

export default requestGeoJSON; 
