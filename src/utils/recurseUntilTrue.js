const recurseUntilTrue = function recurseUntilTrue(func, condition, initialArg) {
	window.console.log("recurseUntilTrue()"); 
	window.console.log("initialArg:", initialArg); 
	const result = func(initialArg); 

	if (condition(result)) return result; 

	return recurseUntilTrue(func, condition, result); 

}; 

export default recurseUntilTrue; 
