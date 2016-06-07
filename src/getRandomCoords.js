/* global window */

import selectRandomValueOfRange from './selectRandomValueOfRange'; 

/**
 *
 * getRandomCoords() - Select random point from within min / max 
 *     lat / lng range
 *
 */

const getRandomCoords = function getRandomCoords(latLngMaxMin) {

	const { lat, lng } = latLngMaxMin; 

	const randomLat = selectRandomValueOfRange(lat.min, lat.max).toFixed(6); 
	
	const randomLng = selectRandomValueOfRange(lng.min, lng.max).toFixed(6); 

	window.console.log("randomLat:", randomLat); 
	window.console.log("randomLng:", randomLng); 

	const randomCoords = { randomLat, randomLng }; 
	
	return randomCoords; 

}; 

export default getRandomCoords; 
