/* global window */

import { isType, poll, walkArray } from './utils/utils'; 

const overriddenMethods = []; 

const MAXIMUM_ANNOTATION_LENGTH = 2000; 

const POLL_INTERVAL = 50; 

const POLL_TIMEOUT = 3000; 

const getGoogleCallbacks = function getGoogleCallbacks() {

	const windowProps = Object.keys(window);

	const googCallbacks = windowProps.filter(prop => prop.slice(0, 10) === "_callbacks"); 

	return googCallbacks; 

}; 

const overridingCallback = function overridingCallback(originalCallback, panorama) {

	return (...args) => {

		// Recursively walk through the large array of metadata passed to the Google callback.  
		// Some of the entities appear to be data images, so if the entity is a string with a 
		// short length, then check the panorama's 'shortDescription' property, which is the 
		// same as the label that appears on the map.  If the entity matches the 
		// 'shortDescription' value, then replace the entity with an empty string.  
		walkArray(args, function (el, i, arr, path) {  // eslint-disable-line no-unused-vars 
			

			if (!(isType('string', el))) return; 

			if (el.length > MAXIMUM_ANNOTATION_LENGTH) return; 

			const { shortDescription } = panorama.getLocation(); 

			if (shortDescription.toLowerCase().indexOf(el.toLowerCase()) === -1) return; 
			
			arr[i] = "";  // Erase label 

		}); 

		return originalCallback(...args); 

	}; 

}; 

const overrideCallback = function overrideCallback(overriddenMethods, panorama) {

	let callbackOverridden = false; 

	var googCallbacks = getGoogleCallbacks(); 

	if (googCallbacks.length === 0) return; 

	/*----------  Override callbacks assigned to window._callbacks___<hash>.  ----------*/

	googCallbacks.forEach(callback => {

		if (overriddenMethods.indexOf(callback) > -1) return;  // If method has already been overridden, exit 

		overriddenMethods.push(callback); 

		const originalCallback = window[callback]; 

		window[callback] = overridingCallback(originalCallback, panorama); 

		callbackOverridden = true;  // Returning true stops the polling 

	}); 

	return callbackOverridden; 

}; 


const removeStreetNameAnnotations = function removeStreetNameAnnotations(panorama) {

	poll(() => overrideCallback(overriddenMethods, panorama), POLL_INTERVAL, POLL_TIMEOUT) 

		// Sometimes multiple 'pano_changed' events fire in succession, causing the code to find 
		// and replace a callback on the first event, but not the second, causing the poll's 
		// timeout to expire.  Catch and ignore the timeout expiration error in this case. 
		.catch(e => e);   

}; 

export default removeStreetNameAnnotations; 
