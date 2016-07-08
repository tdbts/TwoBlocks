/**
 *
 * getLatLngMaxMin() - Function which takes a set of lat / lng 
 *     values, and gets the max / min for both lat / lng 
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

			lat.min = lat.max = curr.lat(); 
			lng.min = lng.max = curr.lng(); 

		} else {

			lat.min = Math.min(lat.min, curr.lat()); 
			lat.max = Math.max(lat.max, curr.lat()); 
			lng.min = Math.min(lng.min, curr.lng()); 
			lng.max = Math.max(lng.max, curr.lng()); 

		}

		return prev; 

	}, latLngMaxMin); 				

	return latLngMaxMin; 

}; 

export default getLatLngMaxMin; 
