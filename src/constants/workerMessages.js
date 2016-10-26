const workerMessages = {

	GEO_JSON_LOADED: 'GEO_JSON_LOADED',  // worker to main thread 
	GET_RANDOM_LOCATION: 'GET_RANDOM_LOCATION', // main thread to worker...in payload, need to indicate when it is a new turn so a new location generator can be instantiated  
	LOAD_GEO_JSON: 'LOAD_GEO_JSON', 
	RANDOM_LOCATION_CHOSEN: 'RANDOM_LOCATION_CHOSEN', // worker to main thread 
	REQUEST_GEO_JSON: 'REQUEST_GEO_JSON', // main thread to worker 
	SENDING_GEO_JSON: 'SENDING_GEO_JSON'  // worker to main thread 

}; 

export default workerMessages; 
