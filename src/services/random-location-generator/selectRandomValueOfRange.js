const selectRandomValueOfRange = (min, max) => {

	if (('number' !== typeof min) || ('number' !== typeof max)) {

		throw new Error("The arguments passed to 'selectRandomValueOfRange()' must be numbers."); 
		
	}

	// If the order is incorrect, switch. 
	if (!(min <= max)) {
		
		( [ min, max ] = [ max, min ] );
	
	}

	const difference = max - min; 

	return min + (Math.random() * difference); 

}; 

export default selectRandomValueOfRange; 
