const sortLeastToGreatest = function sortLeastToGreatest(numbers) {

	return numbers
		
		.slice()  // Don't modify the given array 
		
		.sort((a, b) => {

			if (('number' !== typeof a) || ('number' !== typeof b)) {

				throw new Error("All elements of the given numbers array must be of type 'number'."); 
				
			}

			if (a < b) return -1; 
			if (a > b) return 1; 
			if (a === b) return 0; 

		}); 

}; 

export default sortLeastToGreatest; 
