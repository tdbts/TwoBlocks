/* global google */

const calculateDistanceBetweenLatLngs = function calculateDistanceBetweenLatLngs(first, second) {

	return google.maps.geometry.spherical.computeDistanceBetween(first, second); 	

};

export default calculateDistanceBetweenLatLngs; 
