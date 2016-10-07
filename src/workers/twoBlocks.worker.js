/* global self */

import 'babel-polyfill'; 

try {

	const onMessage = function onMessage(event) {

		const message = event.data; 

		self.postMessage(`Heard message from the DOM: ${message}`); 
		// self.postMessage(event); 

	}; 

	self.addEventListener('message', onMessage); 

} catch (e) {

	self.postMessage("Caught an error:", e); 
	
}
