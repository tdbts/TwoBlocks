/**
 *
 * getLatLngMaxMin() - Function which takes a set of lat / lng 
 *     values, and gets the max / min for both lat / lng 
 *
 */

// Order for latitude, longitude is reversed (lng, lat) for GeoJSON spec.
const LATITUDE_INDEX = 1; 
const LONGITUDE_INDEX = 0; 

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

			lat.min = lat.max = curr[LATITUDE_INDEX]; 
			lng.min = lng.max = curr[LONGITUDE_INDEX]; 

		} else {

			lat.min = Math.min(lat.min, curr[LATITUDE_INDEX]); 
			lat.max = Math.max(lat.max, curr[LATITUDE_INDEX]); 
			lng.min = Math.min(lng.min, curr[LONGITUDE_INDEX]); 
			lng.max = Math.max(lng.max, curr[LONGITUDE_INDEX]); 

		}

		return prev; 

	}, latLngMaxMin); 				

	return latLngMaxMin; 

}; 

export default getLatLngMaxMin; 
