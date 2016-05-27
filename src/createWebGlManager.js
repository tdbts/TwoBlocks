/* global document, window */

import { EventEmitter } from 'events'; 
import { inherits } from 'util'; 

/*==========================================
=            createWebGlManager            =
==========================================*/

const createWebGlManager = function createWebGlManager(canvas) {

	const WebGlManager = function WebGlManager(canvas) {

		this.canvas = canvas; 
	
	};  

	// Inherit from EventEmitter
	inherits(WebGlManager, EventEmitter); 

	// Extend WebGlManager prototype with 
	// desired functionality. 
	Object.assign(WebGlManager.prototype, {

		canUseWebGl() {

			if (!(window.WebGLRenderingContext)) return false; 

			const testCanvas = document.createElement('canvas');

			let result; 

			if (testCanvas && ('getContext' in testCanvas)) {

				const webGlNames = [
					"webgl",
					"experimental-webgl",
					"moz-webgl",
					"webkit-3d"
				];

				// Reduce the array of webGlNames to a single boolean, 
				// which represents the result of canUseWebGl().  
				result = webGlNames.reduce((prev, curr) => {
					
					if (prev) return prev;  // If 'prev' is truthy, we can use WebGL. 
				
					const context = testCanvas.getContext(curr); 

					if (context && (context instanceof WebGLRenderingContext)) return true; 

				}, false);  // Start with false (default) 

			}

			return result;	

		}, 

		initGl() {

			if (this.canvas) {

				this.canvas.addEventListener('webglcontextrestored', () => this.emit('webglcontextrestored')); 

			}

		}

	}); 

	// Return class instance which has inherited 
	// our desired functionality 
	return new WebGlManager(canvas); 

}; 

/*=====  End of createWebGlManager  ======*/

export default createWebGlManager; 
