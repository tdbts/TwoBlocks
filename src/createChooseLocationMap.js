/* global google */

import { DEFAULT_MAP_ZOOM } from './constants/constants'; 

const DEFAULT_LAT = 40.6291566; 
const DEFAULT_LNG = -74.0287341; 

const createChooseLocationMap = function createChooseLocationMap(canvas, options) {

	if (!(canvas)) {

		throw new Error("No canvas passed to createChooseLocationMap()."); 

	}

	const defaultOptions = {
		center: new google.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG), 
		mapTypeControl: false, 
		mapTypeId: google.maps.MapTypeId.ROADMAP, 
		scrollwheel: false, 
		streetViewControl: false, 
		zoom: DEFAULT_MAP_ZOOM, 
		zoomControl: false
	}; 

	const mapOptions = Object.assign({}, defaultOptions, options); 

	const map = new google.maps.Map(canvas, mapOptions); 

	return map; 

}; 

export default createChooseLocationMap; 
