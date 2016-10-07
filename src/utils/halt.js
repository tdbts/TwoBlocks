/**
 *
 * halt() - Pass in a function and some arguments, and 
 * 		it returns a function which will call the given 
 * 		function with the given arguments.  Good for 
 * 		when you want to set up an invocation, without 
 * 		actually invoking yet.  
 * 
 * @param func { function } - Function to invoke. 
 * @param args { array } - Arguments to pass on invocation. 
 * 
 * @returns { function } - Anonymous function which invokes the 
 * 		given function with the given arguments.  
 * 
 */

function halt(func, args) {
	return function () {
		func.call(this, ...args); 
	}; 
}

export default halt; 
