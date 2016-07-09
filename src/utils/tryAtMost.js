const tryAtMost = function tryAtMost(thenable, maxTries, onCaught = function () {}) {

	return thenable().catch((...args) => {

		maxTries -= 1; 

		onCaught(...args, maxTries); 

		if (maxTries < 1) {

			// Error must be thrown to be caught by 
			// the caller of tryAtMost() 
			throw new Error("Maximum number of tries exceeded."); 
		
		}

		// Recurse 
		return tryAtMost(thenable, maxTries, onCaught); 		

	}); 

}; 

export default tryAtMost; 
