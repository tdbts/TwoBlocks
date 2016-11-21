/* global google */

import requestGeoJSON from './requestGeoJSON'; 
import injectGapiScript from './injectGapiScript'; 
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

	loadGoogleMaps() {

		return injectGapiScript("AIzaSyDuL3PsXv2Rc2qpVN5ZfLNa2tkdnrFJmBE") 

			/*----------  Poll for 'geometry' library in google.maps object  ----------*/

			.then(() => {

				const geometryLibraryLoaded = () => 'geometry' in google.maps; 

				const INTERVAL = 25;  // milliseconds 

				const TIMEOUT = 5000;  // milliseconds 

				const pollForGeometryLibrary = poll(geometryLibraryLoaded, INTERVAL, TIMEOUT); 

				return pollForGeometryLibrary; 				
			
			}); 

	}, 

	usingWorker() {

		return !!(this.worker); 

	}

}; 

export default TwoBlocksService; 
