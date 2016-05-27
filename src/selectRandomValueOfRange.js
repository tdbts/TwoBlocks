const selectRandomValueOfRange = (min, max) => {

	// If the order is incorrect, switch. 
	if (!(min <= max)) {
		
		( [ min, max ] = [ max, min ] );
	
	}

	const difference = max - min; 

	return min + (Math.random() * difference); 

}; 

export default selectRandomValueOfRange; 
