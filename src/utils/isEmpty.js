import getType from './getType'; 
import isType from './isType';  
import keys from './keys'; 

function isEmpty(item) {
	let result; 

	if (isType(['string', 'array'], item)) {
		result = item.length === 0; 
	
	} else if (isType('object', item)) {
		result = isEmpty(keys(item)); 
	
	} else {
		throw new Error("isEmpty() cannot be used on {" + item + "} because its type is: " + getType(item)); 
	}

	return result; 
}

export default isEmpty; 
