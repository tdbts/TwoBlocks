import isType from './isType'; 
import getType from './getType'; 
import keys from './keys';

function length(item) {
	let result; 

	if (isType(['array', 'string', 'function'], item)) {
		result = item.length; 
	} else if ('object' === getType(item)) {
		result = length(keys(item));
	}

	return result; 
}

export default length; 
