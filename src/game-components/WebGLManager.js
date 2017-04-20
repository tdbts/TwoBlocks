/* global document, window */

import { EventEmitter } from 'events'; 
// import { inherits } from 'util'; 

const WebGLManager = function WebGLManager(canvas) {

	// Call superclass
	EventEmitter.call(this);

	this.canvas = canvas; 

};  

/*----------  Inherit from EventEmitter()  ----------*/

WebGLManager.prototype = Object.create(EventEmitter.prototype);

/*----------  Assign constructor  ----------*/

WebGLManager.prototype.constructor = WebGLManager;

/*----------  Define Methods  ----------*/

const webGLManagerMethods = {

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

}; 

/*----------  Add methods to prototype  ----------*/

for (const method in webGLManagerMethods) {

	WebGLManager.prototype[method] = webGLManagerMethods[method];

}

export default WebGLManager; 
