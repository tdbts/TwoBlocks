import followPath from './followPath'; 
import isNothing from './isNothing'; 
import isType from './isType'; 
import length from './length'; 

const existenceCheck = (props, obj) => {
	let result = false; 

	if (isNothing(props) || (length(props) < 1) || !(isType(['string', 'array'], props))) {
		throw new Error("Missing or invalid properties passed to existenceCheck()"); 
	} 

	try {
		followPath(isType('array', props) ? props : [props], obj); 

		result = true; 

	} catch (ignore) {
		/* If followPath() throws an error, result will not be set to true. */
	}

	return result; 
}; 

export default existenceCheck; 
