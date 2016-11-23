/* global google */

import { mapTypes, DEFAULT_MAP_OPTIONS } from './constants/constants'; 
import ChooseLocationMap from './ChooseLocationMap'; 

const createChooseLocationMap = function createChooseLocationMap(canvas, options, mobile) {  // eslint-disable-line no-unused-vars 

	if (!(canvas)) {

		throw new Error("No canvas passed to createChooseLocationMap()."); 

	}

	const mapOptions = Object.assign({}, DEFAULT_MAP_OPTIONS, options); 
	const map = new google.maps.Map(canvas, mapOptions); 

	return new ChooseLocationMap(map, mapTypes.GOOGLE); 

}; 

export default createChooseLocationMap; 
