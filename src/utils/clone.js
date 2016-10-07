// Inspired by accepted answer at the following Stack Overflow question: 
// http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object 
import getType from './getType'; 
import isOneOf from './isOneOf'; 

function clone(obj) {
    let result;
    let copy; 

    // Handle the 3 simple types (string, number, boolean), 
    // as well as NaN, null or undefined
    if (isOneOf(['null', 'undefined', 'NaN', 'string', 'number', 'boolean'], getType(obj))) {
        result = obj; 
    
    } else if (obj instanceof Date) { // Handle instances of Date
        copy = new Date();

        copy.setTime(obj.getTime());

        result = copy;

    } else if ('array' === getType(obj)) { // Handle arrays

        copy = [];

        for (let i = 0, length = obj.length; i < length; i++) {
            copy[i] = clone(obj[i]);
        }

        result = copy;
    
    } else if ('object' === getType(obj)) { // Handle objects
        copy = {};

        for (const attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = clone(obj[attr]);  
            } 
        }

        result = copy;
    }

    return result; 
}

export default clone;
