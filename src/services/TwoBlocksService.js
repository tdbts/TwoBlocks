import requestGeoJSON from './requestGeoJSON'; 
import injectGapiScript from './injectGapiScript';
import loadLeaflet from './loadLeaflet';  
import getRandomPanoramaLocation from './getRandomPanoramaLocation'; 

/*----------  Constructor  ----------*/

const TwoBlocksService = function TwoBlocksService(worker) {

	this.worker = worker; 

}; 

/*----------  Prototype  ----------*/

TwoBlocksService.prototype = {

	getRandomPanoramaLocation(featureCollection) {

		return getRandomPanoramaLocation(this.worker, featureCollection); 

	}, 

	isUsingWorker() {

		return !!(this.worker); 

	},

	loadCityLocationData(url) {

		return requestGeoJSON(url, this.worker); 

	}, 

	loadGoogleMaps(MAPS_API_KEY) {

		return injectGapiScript(MAPS_API_KEY); 

	}, 

	loadLeaflet() {

		return loadLeaflet(); 

	}, 

	mobileMapLibraryLoaded() {

		return !!(window.L); 

	}

}; 

export default TwoBlocksService; 
