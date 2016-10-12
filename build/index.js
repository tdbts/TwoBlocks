/* global document, google, window */

import 'babel-polyfill'; 
import React from 'react'; 
import TwoBlocks from '../src/components/TwoBlocks'; 
import injectGapiScript from '../src/injectGapiScript'; 
// import store from '../src/store';
import { poll } from '../src/utils/utils'; 
import { render } from 'react-dom';
// import { Provider } from 'react-redux'; 

require('../public/css/two-blocks.css');  // Use Webpack loaders to add CSS 

injectGapiScript("AIzaSyDuL3PsXv2Rc2qpVN5ZfLNa2tkdnrFJmBE") 

	/*----------  Poll for 'geometry' library in google.maps object  ----------*/

	.then(() => {

		const geometryLibraryLoaded = () => 'geometry' in google.maps; 

		const pollForGeometryLibrary = poll(geometryLibraryLoaded, 25, 5000); 

		return pollForGeometryLibrary; 				
	
	})

	.then(() => render(
		// <Provider store={store}>
			<TwoBlocks />, 
		// </Provider>, 
		document.getElementById('app-container')));
