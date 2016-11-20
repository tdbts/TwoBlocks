/* global document, google, window */

import 'babel-polyfill'; 
import React from 'react'; 
import TwoBlocks from '../src/components/TwoBlocks';
import TwoBlocksGame from '../src/TwoBlocksGame';
import TwoBlocksService from '../src/TwoBlocksService';   
import TwoBlocksWorker from '../src/workers/twoBlocks.worker.js';
import injectGapiScript from '../src/injectGapiScript'; 
import twoBlocks from '../src/reducers/twoBlocks';

import { createStore } from 'redux';
import { render } from 'react-dom';
import { poll } from '../src/utils/utils';
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

/*----------  Create TwoBlocks Game Instance  ----------*/

const gameInstance = new TwoBlocksGame(store, worker); 

window.console.log("gameInstance:", gameInstance); 

/*----------  Start Loading the GeoGson Immediately  ----------*/

const { GEO_JSON_SOURCE } = nycCoordinates; 

if (worker) {

	worker.onmessage = e => window.console.log("Worker message:", e.data); 

	worker.addEventListener('error', e => window.console.log("Worker error:", e)); 

}

/*----------  Create service for data requests  ----------*/

const service = new TwoBlocksService(worker); 

window.console.log("service:", service); 

service.requestCityLocationData(GEO_JSON_SOURCE)  // The GeoJSON is heavy.  Start loading it as soon as possible 

	.then(response => {

		const payload = response ? response.body : null; 
		window.console.log("Service got da data.  Indicating data load."); 
		// When a Web Worker is available, the GeoJSON object stays on the worker 
		// thread, and the game instance requests data as needed.  Without 
		// a worker, however, this is not the case.  Here, once the GeoJSON has been 
		// loaded, inform the game instance and pass the JSON to it for reference.
		gameInstance.emit(events.GEO_JSON_LOADED, payload); 

	}); 	

/*----------  Add Google Maps Script  ----------*/

injectGapiScript("AIzaSyDuL3PsXv2Rc2qpVN5ZfLNa2tkdnrFJmBE") 

	/*----------  Poll for 'geometry' library in google.maps object  ----------*/

	.then(() => {

		const geometryLibraryLoaded = () => 'geometry' in google.maps; 

		const pollForGeometryLibrary = poll(geometryLibraryLoaded, 25, 5000); 

		return pollForGeometryLibrary; 				
	
	})

	.then(() => render(
		// <Provider store={store}>
			<TwoBlocks 
				gameInstance={ gameInstance }
				locationData= { nycCoordinates }
				store={ store }
				worker={ worker }
			/>, 
		// </Provider>, 
		document.getElementById('app-container')));
