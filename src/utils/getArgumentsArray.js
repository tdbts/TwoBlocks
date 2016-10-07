// Obselete now that ES2015 is here, but 
// still useful in browsers for a couple of years.  

function getArgumentsArray(args, start, end) { 
	return Array.prototype.slice.call(args, start, end); 
}

export default getArgumentsArray;
