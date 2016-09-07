/* global google */

import { DEFAULT_MAP_OPTIONS } from './constants/constants'; 

const createChooseLocationMap = function createChooseLocationMap(canvas, options) {

	if (!(canvas)) {

		throw new Error("No canvas passed to createChooseLocationMap()."); 

	}

	const mapOptions = Object.assign({}, DEFAULT_MAP_OPTIONS, options); 
	const map = new google.maps.Map(canvas, mapOptions); 

	return map; 

}; 

export default createChooseLocationMap; 
