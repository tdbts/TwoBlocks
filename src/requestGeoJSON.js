/* global window */

import request from 'superagent'; 
import { workerMessages } from './constants/constants'; 

const requestGeoJSON = function requestGeoJSON(url, worker) {

	let result = null; 

	/*----------  If TwoBlocks WebWorker, use it to load the GeoJSON  ----------*/
	
	if (worker) {

		result = new Promise(resolve => {

			worker.addEventListener('message', event => {

				const { message } = event.data; 

				if (workerMessages.GEO_JSON_LOADED === message) {

					resolve(); 

				}

			});  

		}); 

		/*----------  Instruct worker to load GeoJSON  ----------*/
		
		worker.postMessage({

			message: workerMessages.LOAD_GEO_JSON, 
			payload: url

		});  

	} else {

		result = request.get(url);  

	}	

	return result; 

}; 

export default requestGeoJSON; 
