/* global document, window */

import 'babel-polyfill'; 
import React from 'react'; 
import TwoBlocks from '../src/components/TwoBlocks';
import TwoBlocksGame from '../src/TwoBlocksGame';
import TwoBlocksService from '../src/services/TwoBlocksService';   
import TwoBlocksWorker from '../src/workers/twoBlocks.worker.js';
import twoBlocks from '../src/reducers/twoBlocks';

import { createStore } from 'redux';
import { render } from 'react-dom';
import { events, nycCoordinates } from '../src/constants/constants';  
import { composeWithDevTools } from 'redux-devtools-extension';
// import { Provider } from 'react-redux'; 

require('../public/css/two-blocks.css');  // Use Webpack loaders to add CSS 

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

const gameInstance = new TwoBlocksGame(store, worker, service); 

window.console.log("gameInstance:", gameInstance); 

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
		gameInstance.emit(events.GEO_JSON_LOADED, payload); 

	})

	.catch(e => window.console.error(e)); 

/*----------  Add Google Maps Script  ----------*/

service.loadGoogleMaps(process.env.MAPS_API_KEY) 

	.then(() => render(
		// <Provider store={store}>
			<TwoBlocks 
				gameInstance={ gameInstance }
				locationData= { nycCoordinates }
				service={ service }
				store={ store }
				worker={ worker }
			/>, 
		// </Provider>, 
		document.getElementById('app-container')));
