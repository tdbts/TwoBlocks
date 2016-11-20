import requestGeoJSON from './requestGeoJSON'; 
import { workerMessages } from './constants/constants'; 

/*----------  Constructor  ----------*/

const TwoBlocksService = function TwoBlocksService(worker) {

	this.worker = worker; 

}; 

/*----------  Prototype  ----------*/

TwoBlocksService.prototype = {

	requestCityLocationData(url) {

		return requestGeoJSON(url, this.worker); 

	}, 

	usingWorker() {

		return !!(this.worker); 

	}

}; 

export default TwoBlocksService; 
