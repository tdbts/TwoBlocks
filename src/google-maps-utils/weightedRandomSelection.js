const weightedRandomSelection = function weightedRandomSelection(a, b) {

	const argsAreValid = [a, b].every(num => {

		return (num > 0) && (num % 1 === 0); 

	}); 

	if (!(argsAreValid)) {

		throw new Error("Given numbers must be positive integers"); 

	}

	// Switch arguments if greater number is not first  
	if (a < b) {

		[ a, b ] = [ b, a ]; 
	
	}

	const total = a + b;

	// Math.random() generates a (pseudo)-random 
	// number between 0 and 1.  If that random 
	// number is greater than the proportion of 
	// the total that belongs to 'a', then 'b' 
	// has won.  
	if (Math.random() > (a / total)) {

		return b; 

	} else {

		return a; 

	}

}; 

export default weightedRandomSelection; 
