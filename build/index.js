/* global document, window */

import 'babel-polyfill'; 
import React from 'react'; 
import TwoBlocks from '../src/components/TwoBlocks';
import Gameplay from '../src/game-components/Gameplay';
import TwoBlocksService from '../src/services/TwoBlocksService';   
import TwoBlocksWorker from '../src/workers/twoBlocks.worker.js';
import twoBlocks from '../src/reducers/twoBlocks';
import twoBlocksUtils from '../src/game-utils/twoBlocksUtils';
import { createStore } from 'redux';
import { render } from 'react-dom';
import { events, nycCoordinates } from '../src/constants/constants';  
import { composeWithDevTools } from 'redux-devtools-extension';
// import { Provider } from 'react-redux'; 

/*----------  Create Redux Store  ----------*/

const createStoreArgs = [ twoBlocks ]; 

if ('development' === process.env.NODE_ENV) {

	createStoreArgs.push(composeWithDevTools()); 

}

const store = createStore(...createStoreArgs); 

/*----------  Create TwoBlocks WebWorker  ----------*/

const worker = window.Worker ? new TwoBlocksWorker() : null;

/*----------  Create service for data requests  ----------*/

const service = new TwoBlocksService(worker); 

window.console.log("service:", service); 

/*----------  Create TwoBlocks Game Instance  ----------*/

const gameplay = new Gameplay(store, worker, service); 

window.console.log("gameplay:", gameplay); 

/*----------  Start Loading the GeoGson Immediately  ----------*/

const { GEO_JSON_SOURCE } = nycCoordinates; 

if (worker) {

	worker.onmessage = e => window.console.log("Worker message:", e.data); 

	worker.addEventListener('error', e => window.console.log("Worker error:", e)); 

}

service.loadCityLocationData(GEO_JSON_SOURCE)  // The GeoJSON is heavy.  Start loading it as soon as possible 

	.then(response => {

		const payload = response ? response.body : null; 

		// When a Web Worker is available, the GeoJSON object stays on the worker 
		// thread, and the game instance requests data as needed.  Without 
		// a worker, however, this is not the case.  Here, once the GeoJSON has been 
		// loaded, inform the game instance and pass the JSON to it for reference.
		gameplay.emit(events.GEO_JSON_LOADED, payload); 

	})

	.catch(e => window.console.error(e)); 

/*----------  Start Loading Leaflet Library  ----------*/

const mobile = twoBlocksUtils.shouldUseDeviceOrientation();

if (mobile) {

	service.loadLeaflet()

		.then(() => window.console.log("window.L:", window.L)); 

}

/*----------  Add Google Maps Script  ----------*/

service.loadGoogleMaps(process.env.MAPS_API_KEY) 

	.then(() => render(
		// <Provider store={store}>
			<TwoBlocks 
				gameplay={ gameplay }
				locationData={ nycCoordinates }
				mobile={ mobile }
				service={ service }
				store={ store }
				worker={ worker }
			/>, 
		// </Provider>, 
		document.getElementById('app-container')))

	.catch(e => window.console.error(e)); 
