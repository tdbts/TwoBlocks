/* global window */

import { EventEmitter } from 'events'; 
import { isOneOf } from './utils/utils'; 
import { inherits } from 'util'; 

/*=====================================
=            createSpinner()            =
=====================================*/

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

const createSpinner = (panorma, options = {}) => {

	const DEGREES_IN_A_CIRCLE  	= 360; 
	const DELAY_DEFAULT  		= 1000; 	// Milliseconds  
	const INCREMENT_DEFAULT  	= 1; 		// Degrees 
	const INTERVAL_DEFAULT  	= 25; 		// Milliseconds 
	const SEGMENTS_DEFAULT  	= 4; 
	const VALID_SEGMENTS 		= [2, 4, 6, 9, 12]; 

	let _canSpin = false; 
	let _paused = false; 
	let _started = false; 
	let _startHeading = null; 
	let segments = null; 
	let delay = null; 
	let increment; 
	let interval; 
	let timer;  

	let spinner = null; 

	const handlePunctuationOption = function handlePunctuationOption(options) {

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

	const incrementHeading = function incrementHeading(pov, increment) {
	
		pov.heading += increment; 

		while (pov.heading > DEGREES_IN_A_CIRCLE) {
			pov.heading -= DEGREES_IN_A_CIRCLE; 
		} 

		while (pov.heading < 0) {
			pov.heading += DEGREES_IN_A_CIRCLE; 
		} 			

		return pov; 
	
	};

	// Initial implementation assumes that we are incrementing 
	// the spin by one degree each time we call spin().  
	// TODO: Make this more sophisticated and robust.  
	const punctuate = function punctuate(pov, segments, delay) {
		
		// Heading is the number of degrees from cardinal direction North 
		const { heading } = pov; 

		// The valid values for 'segments' evenly divide 360 degrees.  
		// If the heading is evenly divisible by the number of degrees 
		// in each segment, the spinning has completed one partial 
		// rotation, and it is time to pause the movement.  
		if ((heading % (DEGREES_IN_A_CIRCLE / segments)) === 0) {

			_paused = true;  

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
				if (_canSpin) { 
				
					api.start();
				
				}

			}, delay);

		} 
	
	};

	/*----------  Set punctuation options  ----------*/

	const punctuated = handlePunctuationOption(options); 

	if (punctuated) {

		// Parentheses required when destructuring assigns 
		// to previously declared variables.  
		( { segments, delay } = punctuated );

	}

	/*----------  Set increment option  ----------*/
	
	( { increment } = options ); 

	if (!(increment)) {

		increment = INCREMENT_DEFAULT;  // Degrees 
	
	}

	/*----------  Set interval option  ----------*/
	( { interval } = options ); 

	if (!(interval)) {

		interval = INTERVAL_DEFAULT; 

	}

	const api = {

		spin() {

			// window.console.log('spin()'); 

			try {

				const pov = incrementHeading(panorma.getPov(), increment); 

				panorma.setPov(pov); 
				
				if ((pov.heading % DEGREES_IN_A_CIRCLE) === _startHeading) {

					spinner.emit('revolution'); 

				}

				if (punctuated) {

					punctuate(pov, segments, delay); 
				
				}
			
			} catch (e) {
			
				window.console.error("e:", e); 
			
			}

		}, 

		start() {

			_canSpin = true; 
			
			_paused = false; 

			// window.console.log('spinner start()'); 

			if (!(_started)) {

				_started = true;  

				_startHeading = panorma.getPov().heading; 
			
			}
 
			if (!(timer)) {

				timer = setInterval(() => {
					
					if (_canSpin && !(_paused)) {

						this.spin(); 

					}

				}, interval); 

			}
 
		}, 

		started() {

			return _started; 

		}, 

		stop() {

			_canSpin = false; 

		}
	
	};

	/*----------  Create Spinner instance  ----------*/
	
	// Create Spinner() constructor to inherit EventEmitter functionality 
	const Spinner = function Spinner() {}; 

	inherits(Spinner, EventEmitter); 

	// Add API methods to prototype 
	Object.assign(Spinner.prototype, api); 

	spinner = new Spinner();

	return spinner;  

};

/*=====  End of createSpinner()  ======*/


export default createSpinner; 
