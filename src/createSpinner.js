/* global window */

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

	const DEGREES_IN_A_CIRCLE = 360; 
	const DELAY_DEFAULT = 1000;  // Milliseconds  
	const INCREMENT_DEFAULT = 1;  // Degrees 
	const INTERVAL_DEFAULT = 25;  // Milliseconds 
	const SEGMENTS_DEFAULT = 4; 

	let segments = null; 
	let delay = null; 
	let increment; 
	let interval; 
	let timer;  

	const handlePunctuationOption = function handlePunctuationOption(options) {

		if ('punctuate' in options) {

			let { segments, delay } = options.punctuate; 

			if (!(segments)) {
				segments = SEGMENTS_DEFAULT; 
			} 

			if (!(delay)) {
				delay = DELAY_DEFAULT; 
			}

			return { segments, delay }; 

		}

	};

	const incrementHeading = function incrementHeading(pov, increment) {
	
		pov.heading += increment; 

		while (pov.heading > DEGREES_IN_A_CIRCLE) {
			pov.heading -= DEGREES_IN_A_CIRCLE; 
		} 

		while (pov.heading < 0.0) {
			pov.heading += DEGREES_IN_A_CIRCLE; 
		} 			

		return pov; 
	
	};

	// Initial implementation assumes that we are incrementing 
	// the spin by one degree each time we call spin().  
	// TODO: Make this more sophisticated and robust.  
	const punctuate = function punctuate(pov, segments, delay) {
		
		const { heading } = pov; 

		if ((heading % (DEGREES_IN_A_CIRCLE / segments)) === 0) {

			api.stop(); 

			setTimeout(() => api.start(), delay);

		} 
	
	};

	/*----------  Set punctuation options  ----------*/

	const punctuated = handlePunctuationOption(options); 

	if (punctuated) {

		segments = punctuated.segments; 
		delay = punctuated.delay; 

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

			try {

				const pov = incrementHeading(panorma.getPov(), increment); 

				panorma.setPov(pov); 

				if (punctuated) {

					punctuate(pov, segments, delay); 
				
				}
			
			} catch (e) {
			
				window.console.error("e:", e); 
			
			}

		}, 

		start() {

			clearInterval(timer); 

			timer = setInterval(this.spin, interval); 

		}, 

		stop() {

			clearInterval(timer); 

		}
	
	};

	return api; 

};

/*=====  End of createSpinner()  ======*/


export default createSpinner; 
