import isSomething from './isSomething'; 

function isNothing(item) {
	return !(isSomething(item)); 
}

export default isNothing; 
