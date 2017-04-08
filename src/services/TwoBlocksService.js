import requestGeoJSON from './requestGeoJSON'; 
import injectGapiScript from './injectGapiScript';
import loadLeaflet from './loadLeaflet';  
import getRandomPanoramaLocation from './getRandomPanoramaLocation'; 

/*----------  Constructor  ----------*/

const TwoBlocksService = function TwoBlocksService(worker) {

	this._loadingLibraries = [];

	this.worker = worker; 


}; 

/*----------  Prototype  ----------*/

TwoBlocksService.prototype = {

	_loadLibrary(loadProcess) {

		this._loadingLibraries.push(loadProcess);

		return loadProcess;

	},

	/*----------  Public API  ----------*/

	getRandomPanoramaLocation(featureCollection) {

		return getRandomPanoramaLocation(this.worker, featureCollection); 

	}, 

	isUsingWorker() {

		return !!(this.worker); 

	},

	librariesAreLoaded() {

		return Promise.all(this._loadingLibraries);

	},

	loadCityLocationData(url) {

		return requestGeoJSON(url, this.worker); 

	}, 

	loadGoogleMaps(MAPS_API_KEY) {

		return this._loadLibrary(injectGapiScript(MAPS_API_KEY));

	}, 

	loadLeaflet() {

		return this._loadLibrary(loadLeaflet());

	}, 

	mobileMapLibraryLoaded() {

		return !!(window.L); 

	}

}; 

export default TwoBlocksService; 
