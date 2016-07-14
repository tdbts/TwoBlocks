import { MILES_PER_METER } from './constants/constants'; 

const convertMetersToMiles = function convertMetersToMiles(meters) {

	const MILES_PER_METER = 0.000621371; 

	return meters * MILES_PER_METER; 

}; 

export default convertMetersToMiles; 
