import isType from './isType'; 

/**
 *
 * @name followPath() 
 *
 * @desc Returns the entity located at the terminus of the 
 *     given path within the given object of nested objects.
 *
 * @param { string[] } path - Array of strings delineating 
 *     the path to follow.  
 * @param { object } obj - The object where the path will be  
 *     followed. 
 * @param { object } options - An object for setting options.
 *     - @prop { boolean } upsert - If true, in cases where the 
 *         property does not exist within the current object, an 
 *         empty object will be created at that property. 
 *     - @prop { function } terminus - A function that will be 
 *         called in order to set the value of the property 
 *         located at the terminus of the given path.     
 * 
 * @returns { any }
 *
 */ 

const followPath = (path, obj, options = {}) => {
	let result; 

	if (path.length === 0) {
		result = obj; 
	
	} else {
		const prop = path[0]; 

		if (isType('object', obj)) {

			if (!(prop in obj)) {

				if ((path.length === 1) && ('terminus' in options)) {

					obj[prop] = options.terminus(obj[prop], obj, prop); 
				
				} else if (('upsert' in options) && options.upsert) {
				
					obj[prop] = {}; 

				} else {
				
					throw new ReferenceError(`The property ${prop} does not exist in the object ${JSON.stringify(obj)}`); 				
				}

			} else if ((path.length === 1) && ('terminus' in options) && isType('function', options.terminus)) {

				obj[prop] = options.terminus(obj[prop], obj, prop); 
			}

		} else {
			throw new Error(`The path ${path} is invalid for the entity ${JSON.stringify(obj)}`); 
		}

		result = followPath(path.slice(1), obj[prop], options); 
	}

	return result; 
 }; 

export default followPath; 
