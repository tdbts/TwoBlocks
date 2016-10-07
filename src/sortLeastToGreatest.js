const sortLeastToGreatest = function sortLeastToGreatest(numbers) {

	return numbers
		
		.slice()  // Don't modify the given array 
		
		.sort((a, b) => {

			if (a < b) return -1; 
			if (a > b) return 1; 
			if (a === b) return 0; 

		}); 

}; 

export default sortLeastToGreatest; 
