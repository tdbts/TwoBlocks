function isOneOf(matches, givenItem) {
	return matches.some(function (match) {
		return match === givenItem; 
	}); 
}

export default isOneOf; 
