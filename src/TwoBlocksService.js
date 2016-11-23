/* global google */

import requestGeoJSON from './requestGeoJSON'; 
import injectGapiScript from './injectGapiScript';
import loadLeaflet from './loadLeaflet';  
import { poll } from './utils/utils'; 
import { workerMessages } from './constants/constants'; 

/*----------  Constructor  ----------*/

const TwoBlocksService = function TwoBlocksService(worker) {

	this.worker = worker; 

}; 

/*----------  Prototype  ----------*/

TwoBlocksService.prototype = {

	loadCityLocationData(url) {

		return requestGeoJSON(url, this.worker); 

	}, 

	loadGoogleMaps(MAPS_API_KEY) {

		return injectGapiScript(MAPS_API_KEY); 

	}, 

	loadLeaflet() {

		return loadLeaflet(); 

	}, 

	usingWorker() {

		return !!(this.worker); 

	}

}; 

export default TwoBlocksService; 
