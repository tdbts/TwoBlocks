import isOneOf from './isOneOf'; 
import isType from './isType'; 

const noUniqueBetweenSets = (first, second) => {

	if (isType('array', first) && isType('array', second)) {

		return first.every(item => isOneOf(second, item)) && second.every(item => isOneOf(first, item)); 
	
	} 

}; 

export default noUniqueBetweenSets; 
