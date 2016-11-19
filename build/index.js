/* global document, google, window */

import 'babel-polyfill'; 
import React from 'react'; 
import requestGeoJSON from '../src/requestGeoJSON'; 
import TwoBlocks from '../src/components/TwoBlocks';
import TwoBlocksGame from '../src/TwoBlocksGame';  
import TwoBlocksWorker from '../src/workers/twoBlocks.worker.js';
import injectGapiScript from '../src/injectGapiScript'; 
import twoBlocks from '../src/reducers/twoBlocks';

import { createStore } from 'redux';
import { render } from 'react-dom';
import { poll } from '../src/utils/utils';
import { nycCoordinates } from '../src/constants/constants';  
import { composeWithDevTools } from 'redux-devtools-extension';
// import { Provider } from 'react-redux'; 

require('../public/css/two-blocks.css');  // Use Webpack loaders to add CSS 

/*----------  Create Redux Store  ----------*/

const devTools = ('development' === process.env.NODE_ENV) ? composeWithDevTools() : function () {}; 

const store = createStore(twoBlocks, devTools); 

/*----------  Create TwoBlocks WebWorker  ----------*/

const worker = window.Worker ? new TwoBlocksWorker() : null;

/*----------  Create TwoBlocks Game Instance  ----------*/

const gameInstance = new TwoBlocksGame(store, worker); 

window.console.log("gameInstance:", gameInstance); 

/*----------  Start Loading the GeoGson Immediately  ----------*/

const { GEO_JSON_SOURCE } = nycCoordinates; 

if (worker) {

	worker.onmessage = e => window.console.log("Heard dis:", e.data); 

	worker.addEventListener('error', e => window.console.log("Fucking error:", e)); 

	requestGeoJSON(GEO_JSON_SOURCE, worker); 

}

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
