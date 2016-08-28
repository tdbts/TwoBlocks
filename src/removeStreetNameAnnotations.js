/* global window */

import { isNumeric, isType, poll, walkArray } from './utils/utils'; 

const overriddenMethods = []; 

const MAXIMUM_ANNOTATION_LENGTH = 2000; 

const getGoogleCallbacks = function getGoogleCallbacks() {

	const windowProps = Object.keys(window);

	const googCallbacks = windowProps.filter(prop => prop.slice(0, 10) === "_callbacks"); 

	return googCallbacks; 

}; 

const overridingCallback = function overridingCallback(originalCallback, panorama) {

	return (...args) => {

		walkArray(args, function (el, i, arr, path) {  // eslint-disable-line no-unused-vars 
			
			if (!(isType('string', el))) return; 

			if (el.length > MAXIMUM_ANNOTATION_LENGTH) return; 

			const { shortDescription } = panorama.getLocation(); 

			if (el.toLowerCase() !== shortDescription.toLowerCase()) return; 
			
			arr[i] = ""; 			

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

		if (overriddenMethods.indexOf(callback) > -1) return; 

		overriddenMethods.push(callback); 

		const originalCallback = window[callback]; 

		window[callback] = overridingCallback(originalCallback, panorama); 

		callbackOverridden = true; 

	}); 

	return callbackOverridden; 

}; 


const removeStreetNameAnnotations = function removeStreetNameAnnotations(panorama) {

	poll(() => overrideCallback(overriddenMethods, panorama), 50, 3000); 

}; 

export default removeStreetNameAnnotations; 
