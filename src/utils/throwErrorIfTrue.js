import isSomething from './isSomething'; 
import isType from './isType'; 

function throwErrorIfTrue(action, item, error) {
	if (isType('function', action) && action(item)) {
		
		if (isSomething(error) && isType('error', error)) {
			throw error;
		
		} else {
			throw new Error(`Threw error because given action '${action}' on item '${item}' returned true.`); 
		}
	}
}

export default throwErrorIfTrue; 
