import applyToOwnProp from './applyToOwnProp'; 
import getProp from './getProp'; 

function getOwnProp(obj, prop) {
	let result; 

	if (prop in obj) {
		result = applyToOwnProp(getProp, obj, prop); 
	
	} else {
		throw new ReferenceError("The property '" + prop + "' does not exist in the provided object: " + JSON.stringify(obj)); 
	}

	return result; 
}

export default getOwnProp; 
