import isOneOf from './isOneOf';  
import { ALL_TYPES } from '../constants/constants'; 

function typeisValid(givenType) {
	return isOneOf(ALL_TYPES, givenType); 
}

export default typeisValid; 
