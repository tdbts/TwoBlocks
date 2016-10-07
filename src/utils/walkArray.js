import isType from './isType'; 

const DEFAULT_ON_TERMINUS = entity => entity; 

const walkArray = function walkArray(arr, onTerminus = DEFAULT_ON_TERMINUS, path) {

	if (!(path)) path = []; 

	arr.forEach((el, i, arr) => {

		path.push(i); 

		if (isType('array', el)) {

			return walkArray(el, onTerminus, path); 

		} else {

			onTerminus(el, i, arr, path); 

		}

	}); 

}; 

export default walkArray; 
