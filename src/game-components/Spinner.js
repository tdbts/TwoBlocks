/* global window */

import { EventEmitter } from 'events'; 
import { isOneOf } from '../utils/utils'; 

/*=================================
=            Spinner()            =
==================================*/

/*----------  Constants  ----------*/

const DEGREES_IN_A_CIRCLE  	= 360; 
const DELAY_DEFAULT  		= 1000; 	// Milliseconds  
const INCREMENT_DEFAULT  	= 1; 		// Degrees 
const INTERVAL_DEFAULT  	= 25; 		// Milliseconds 
const SEGMENTS_DEFAULT  	= 4; 
const VALID_SEGMENTS 		= [2, 4, 6, 9, 12]; 

/**
 *
 * Add options object as last parameter.  Add option to 
 * not spin continuously, but rather, in a series of 
 * partial-spins.  Should be able to split the 360 degrees 
 * into "chunks", spin to one chunk, pause for a few 
 * seconds, and then continue to the next one.  
 *
 * Option will be called 'punctuate'.  Properties will be 
 * 'segments' and 'delay'.  Valid options for segments will be
 * even divisors of 360 -- 12 (30-degrees), 9 (40-degrees), 
 * 6 (60-degrees), 4 (90-degrees), 2 (180-degrees)
 * 
 */

const Spinner = function Spinner(panorama, options = {}) {

	EventEmitter.call(this); 	

	this.events = {
		REVOLUTION: 'REVOLUTION'
	};

	this._canSpin = false;
	this._lastRepaint = null; 
	this._panorama = panorama;  
	this._paused = false; 
	this._started = false; 
	this._startHeading = null; 

	this.delay = null;
	this.punctuated = false;  
	this.segments = null; 
	this.increment; 
	this.interval; 
	this.timer;  

	this._setOptions(options); 

}; 

/*=====  End of Spinner()  ======*/

/*----------  Inherit from EventEmitter  ----------*/

Spinner.prototype = EventEmitter.prototype; 
Spinner.constructor = EventEmitter; 

/*----------  Define Prototype  ----------*/

const spinnerMethods = {

	_incrementHeading(pov, increment) {
		
		pov.heading += increment; 

		while (pov.heading > DEGREES_IN_A_CIRCLE) {
			pov.heading -= DEGREES_IN_A_CIRCLE; 
		} 

		while (pov.heading < 0) {
			pov.heading += DEGREES_IN_A_CIRCLE; 
		} 			

		return pov; 		
	
	}, 

	_onAnimationFrame(timestamp) {

		if (!(this._lastRepaint)) {

			this._lastRepaint = timestamp; 

		}

		const timeSinceLastRepaint = timestamp - this._lastRepaint; 

		if (timeSinceLastRepaint >= this.interval) {

			if (this._canSpin && !(this._paused)) {

				this.spin(); 

			}

			window.requestAnimationFrame(this._onAnimationFrame.bind(this)); 

		} else {

			window.requestAnimationFrame(this._onAnimationFrame.bind(this)); 

		}		

	}, 

	_punctuate(pov) {

		// Heading is the number of degrees from cardinal direction North 
		const { heading } = pov; 

		// The valid values for 'segments' evenly divide 360 degrees.  
		// If the heading is evenly divisible by the number of degrees 
		// in each segment, the spinning has completed one partial 
		// rotation, and it is time to pause the movement.  
		if ((Math.round(heading) % (DEGREES_IN_A_CIRCLE / this.segments)) === 0) {

			this._paused = true;  

			// If we were to pause the spinning on mouseover as 
			// the original author chose to do, we wouldn't actually 
			// want to start spinning when this timeout expires.  
			// So we would need to read the mouseover state somehow 
			// and start only when the timeout has expired AND the 
			// mouse has left the canvas <div>.  This is where something 
			// like Redux is going to shine.  

			setTimeout(() => {

				// If the stop() method has not been called 
				// by the outside world...
				if (this._canSpin) { 
				
					this.start();
				
				}

			}, this.delay);		

		}

	}, 

	_setOptions(options) {

		/*----------  Set punctuation options  ----------*/

		const punctuationOptions = processPunctuationOption(options); 

		if (punctuationOptions) {

			// Parentheses required when destructuring assigns 
			// to previously declared variables.  
			const { segments, delay } = punctuationOptions;

			this.segments = segments; 
			this.delay = delay; 
			this.punctuated = true; 

		}

		/*----------  Set increment option  ----------*/
		
		let { increment } = options; 

		if (!(increment)) {

			increment = INCREMENT_DEFAULT;  // Degrees 
		
		}

		this.increment = increment; 

		/*----------  Set interval option  ----------*/
		
		let { interval } = options; 

		if (!(interval)) {

			interval = INTERVAL_DEFAULT; 

		}		

		this.interval = interval; 

	}, 

	/*----------  Public  ----------*/
	
	spin() {

		try {

			const pov = this._incrementHeading(this._panorama.getPov(), this.increment); 

			this._panorama.setPov(pov); 

			if ((Math.round(pov.heading) % DEGREES_IN_A_CIRCLE) === this._startHeading) {

				this.emit(this.events.REVOLUTION); 

			}

			if (this.punctuated) {

				this._punctuate(pov); 
			
			}
		
		} catch (e) {
		
			window.console.error("e:", e); 
		
		}

	}, 

	start() {

		this._canSpin = true; 
		
		this._paused = false; 

		if (!(this._started)) {

			this._started = true; 

			this._startHeading = Math.round(this._panorama.getPov().heading); 

		}

		if (!(this.timer)) {

			this.timer = window.requestAnimationFrame(this._onAnimationFrame.bind(this)); 

		}		

	}, 

	started() {

		return this._started; 

	}, 

	stop() {

		this._canSpin = false; 

	}	

}; 

/*----------  Assign methods to prototype  ----------*/

for (const method in spinnerMethods) {

	Spinner.prototype[method] = spinnerMethods[method]; 

}

/*----------  Helper Functions  ----------*/

const processPunctuationOption = function processPunctuationOption(options) {

	let punctuateSettings = null; 

	if ('punctuate' in options) {

		let { segments, delay } = options.punctuate; 

		if (!(isOneOf(VALID_SEGMENTS, segments))) {
			
			segments = null; 
		
		}

		if (!(segments)) {

			segments = SEGMENTS_DEFAULT; 
		
		} 

		if (!(delay)) {
		
			delay = DELAY_DEFAULT; 
		
		}

		punctuateSettings = { segments, delay }; 

	}

	return punctuateSettings; 

};

/*----------  Export  ----------*/

export default Spinner; 
