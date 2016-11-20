import requestGeoJSON from './requestGeoJSON'; 

/*----------  Constructor  ----------*/

const TwoBlocksService = function TwoBlocksService(worker) {

	this.worker = worker; 

}; 

/*----------  Prototype  ----------*/

TwoBlocksService.prototype = {

	requestCityLocationData(url) {

		return requestGeoJSON(url, this.worker); 

	}

}; 

export default TwoBlocksService; 
