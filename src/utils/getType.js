import isOneOf from './isOneOf'; 

// Returns the type for any passed entitity.  
// NaN actually evaluates to 'NaN', not "number" as per Javascript quirkiness. 
function getType(item) { 
	
	let result = ((item !== item) ? 'NaN' : Object.prototype.toString.call(item).slice(8, -1).toLowerCase());

	result = isOneOf(['arguments'], result) ? 'object' : result; 

	return result; 
}

export default getType; 
