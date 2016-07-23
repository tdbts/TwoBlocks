const createPromiseTimeout = function createPromiseTimeout(timeout) {

	return new Promise(resolve => {

		setTimeout(resolve, timeout); 

	}); 

}; 

export default createPromiseTimeout; 
