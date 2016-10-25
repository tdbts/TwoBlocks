const tryAtMost = function tryAtMost(thenable, maxTries, onCaught = function () {}) {

	return thenable().catch((...args) => {

		maxTries -= 1; 

		return Promise.resolve()

			.then(() => onCaught(...args, maxTries)) 

			.then(() => {

				if (maxTries < 1) {

					// Error must be thrown to be caught by 
					// the caller of tryAtMost() 
					throw new Error("Maximum number of tries exceeded."); 
				
				}

			})

			// Recurse 
			.then(() => tryAtMost(thenable, maxTries, onCaught)); 

	}); 

}; 

export default tryAtMost; 
