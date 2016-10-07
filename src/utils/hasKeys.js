import isType from './isType'; 

const keyExists = (desiredKey, keys) => {
	return keys.some(key => key === desiredKey); 
}; 

const hasKeys = (keys, obj) => {
	let result = false; 

	if (isType(['array', 'string'], keys) && isType('object', obj)) {
		
		if (isType('array', keys)) {
			result = keys.every(key => keyExists(key, Object.keys(obj))); 
				
		} else {
			result = keyExists(keys, Object.keys(obj)); 
		}

	} else {
		throw new TypeError(`The keys and/or object provided are of an invalid type: 
				keys: ${keys} 
				object: ${JSON.stringify(obj)}`
		); 
	}

	return result; 
}; 

export default hasKeys; 
