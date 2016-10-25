import NYC_BOUNDARIES_DATASET_URL from './NYC_BOUNDARIES_DATASET_URL'; 

const nycCoordinates = {
	
	CENTER: {
		lat: 40.6291566, 
		lng: -74.0287341
	}, 

	GEO_JSON_SOURCE: NYC_BOUNDARIES_DATASET_URL, 

	MARKER_PLACEMENT: {
		lat: 40.480993, 
		lng: -73.72798
	}, 

	boroughCenters: {

		bronx: {
			lat: 40.85329, 
			lng: -73.86932
		}, 

		brooklyn: {
			lat: 40.64418, 
			lng: -73.95309
		}, 

		manhattan: {
			lat: 40.78054, 
			lng: -73.96820
		}, 

		queens: {
			lat: 40.71604, 
			lng: -73.81302
		}, 

		staten_island: {
			lat: 40.58058, 
			lng: -74.15222
		}

	}, 
	
	featureCollection: null, 

	geoJSON: null

};

export default nycCoordinates; 
