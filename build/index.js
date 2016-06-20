/* global document, google, window */

import 'babel-polyfill'; 
import React from 'react'; 
import injectGapiScript from '../src/injectGapiScript'; 
import { poll } from '../src/utils/utils'; 
import TwoBlocks from '../src/components/TwoBlocks.jsx'; 
import { render } from 'react-dom'; 

injectGapiScript() 

	/*----------  Poll for 'geometry' library in google.maps object  ----------*/

	.then(() => {
		window.console.log('Polling for geometry library'); 
		const geometryLibraryLoaded = () => 'geometry' in google.maps; 

		const pollForGeometryLibrary = poll(geometryLibraryLoaded, 25, 5000); 

		return pollForGeometryLibrary; 				
	
	})

	.then(() => render(<TwoBlocks />, document.getElementById('app-container')));
