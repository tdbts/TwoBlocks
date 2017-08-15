import NYC_BOUNDARIES_DATASET_URL from './NYC_BOUNDARIES_DATASET_URL'; 

const nycLocationData = {
	
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

		BRONX: {
			lat: 40.85329, 
			lng: -73.86932
		}, 

		BROOKLYN: {
			lat: 40.64418, 
			lng: -73.95309
		}, 

		MANHATTAN: {
			lat: 40.78054, 
			lng: -73.96820
		}, 

		QUEENS: {
			lat: 40.71604, 
			lng: -73.81302
		}, 

		STATEN_ISLAND: {
			lat: 40.58058, 
			lng: -74.15222
		}

	}
	
};

export default nycLocationData; 
