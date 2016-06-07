/**
 *
 * getLatLngMaxMin() - Function which takes a set of lat / lng 
 * values, and gets the max / min for both lat / lng 
 *
 */

const getLatLngMaxMin = function getLatLngMaxMin(latLngs) {

	let latLngMaxMin = {
		lat: { 
			min: null, 
			max: null 
		}, 
		
		lng: {
			min: null, 
			max: null
		} 				
	}; 

	latLngMaxMin = latLngs.reduce((prev, curr, i) => {

		const { lat, lng } = prev; 

		// On the first invocation, the Lat and Lng 
		// values are both the min and max 
		if (i === 0) {

			const [ currLat, currLng ] = curr; 

			lat.min = lat.max = currLat; 
			lng.min = lng.max = currLng; 

		} else {

			const [ currLat, currLng ] = curr; 

			lat.min = Math.min(lat.min, currLat); 
			lat.max = Math.max(lat.max, currLat); 
			lng.min = Math.min(lng.min, currLng); 
			lng.max = Math.max(lng.max, currLng); 

		}

		return prev; 

	}, latLngMaxMin); 				

	return latLngMaxMin; 

}; 

export default getLatLngMaxMin; 
