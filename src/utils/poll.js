/*==============================
=            poll()            =
==============================*/

const poll = function poll(func, interval = 100, timeout) {

	const endTime = Number(new Date()) + (timeout || 2000); 	

	return new Promise(function checkPolledCondition(resolve, reject) {

		const result = func(); 

		if (result) {

			// If the condition has been met, we're done
			resolve(result); 

		} else if (Number(new Date()) < endTime) {

			// If the condition has not been met but the timeout 
			// has not elapsed, try again 
			setTimeout(() => checkPolledCondition(resolve, reject), interval); 
		
		} else {

			// Reject when the timeout expires 
			reject(new Error(`poll() - Timeout of ${timeout} milliseconds exceeded without the following condition check returning true: ${func}`)); 
		
		}

	}); 

}; 

/*=====  End of poll()  ======*/

export default poll; 
