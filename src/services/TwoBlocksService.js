import TwoBlocksWorker from '../workers/twoBlocks.worker.js';
import requestGeoJSON from './requestGeoJSON'; 
import injectGapiScript from './injectGapiScript';
import loadLeaflet from './loadLeaflet';  
import getRandomPanoramaLocation from './getRandomPanoramaLocation'; 
import { nycLocationData, workerMessages, MAXIMUM_RANDOM_PANORAMA_ATTEMPTS } from '../constants/constants';


export default class TwoBlocksService {

	constructor() {

		this._geoJSON = null;
		this._loadingLibraries = [];

		this._worker = window.Worker ? new TwoBlocksWorker() : null;

		if (this._worker) {

			this._worker.addEventListener('message', e => window.console.log("Worker message:", e.data)); 

			this._worker.addEventListener('error', e => window.console.log("Worker error:", e)); 

		}		

	}

	_loadLibrary(loadProcess) {

		this._loadingLibraries.push(loadProcess);

		return loadProcess;

	}

	_requestGeoJSONFromWorker() {

		const _this = this;

		return new Promise(resolve => {

			/*----------  onGeoJSONSent()  ----------*/

			const onGeoJSONSent = event => {

				const { message, payload } = event.data; 

				if (workerMessages.SENDING_GEO_JSON !== message) return;

				resolve(payload);

				_this._worker.removeEventListener('message', onGeoJSONSent);

			};

			// Assign the event listener before posting message 
			_this._worker.addEventListener('message', onGeoJSONSent);

			// Request GeoJSON from web worker 
			_this._worker.postMessage({

				message: workerMessages.REQUEST_GEO_JSON

			});

		});

	}

	/*----------  Public API  ----------*/

	getGeoJSON() {

		// Keep method asynchronous, as expected 
		if (this._geoJSON) return Promise.resolve(this._geoJSON);

		return this._requestGeoJSONFromWorker();		

	}

	getRandomLocation(featureCollection = null, attemptsLeft = MAXIMUM_RANDOM_PANORAMA_ATTEMPTS) {

		return getRandomPanoramaLocation(this._worker, featureCollection)

			.catch(() => {

				if (attemptsLeft === 0) {

					throw new Error("Attempts to request a random Google Street View failed too many times.  Check your internet connection."); 

				}

				attemptsLeft = attemptsLeft - 1; 

				window.console.log(`Failure to request nearest panorama.  ${attemptsLeft} more attempts left.`);

				return this.getRandomLocation(featureCollection, attemptsLeft); 

			}) 						

			.then(randomLocation => {

				window.console.log("randomLocation:", randomLocation); 

				return randomLocation; 

			});		

	}

	isUsingWorker() {

		return !!(this._worker); 

	}

	librariesAreLoaded() {

		return Promise.all(this._loadingLibraries);

	}

	loadGeoJSON() {

		return requestGeoJSON(nycLocationData.GEO_JSON_SOURCE, this._worker)

			.then(geoJSON => {

				// If we are using a worker, the GeoJSON will 
				// remain on the worker thread until explicitly 
				// requested.  In this case, exit.  If there is 
				// no worker, the GeoJSON will be passed 
				// immediately.
				if (!(geoJSON)) return;

				this._geoJSON = geoJSON;

			});

	} 

	loadCSS() {

		require('../../public/css/two-blocks.css');  // Use Webpack loaders to add CSS 

		// Keep method asynchronous, as expected
		return Promise.resolve();

	}

	loadGoogleMaps(MAPS_API_KEY) {

		return this._loadLibrary(injectGapiScript(MAPS_API_KEY));

	} 

	loadLeaflet() {

		return this._loadLibrary(loadLeaflet());

	}

	loadMobileCSS() {

		require('../../public/css/two-blocks-mobile.css');

		// Keep method asynchronous, as expected
		return Promise.resolve();

	}

	mobileMapLibraryLoaded() {

		return !!(window.L); 

	}


}
