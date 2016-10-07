import getType from './getType'; 
import typeIsValid from './typeIsValid';

const isType = (types, item) => {
	let result;

	if ('array' === getType(types)) {
		
		result = types.some(type => isType(type, item)); 
	
	} else if ('string' === getType(types)) {
		const type = types; 

		if (typeIsValid(type)) {
			result = (type === getType(item)); 
			
		} else {
			throw new TypeError("Invalid type provided: " + type); 
		}
	} 

	return result; 
};

export default isType; 
