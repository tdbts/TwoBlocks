const throttle = function throttle(fn, threshhold = 250, context = this) {
	
	let last; 
	let deferTimer; 

	return function throttler(...args) {
		
		const now = +new Date; 

		if (last && now < last + threshhold) {

			// hold onto it
			clearTimeout(deferTimer); 

			deferTimer = setTimeout(function() {
				
				last = now; 

				fn.apply(context, args); 

			}, threshhold);
		
		} else {

			last = now; 

			fn.apply(context, args); 

		}

	}; 

}; 

export default throttle; 
