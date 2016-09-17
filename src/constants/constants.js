import events from './events'; 
import heardKeys from './heardKeys'; 
import keyEventMaps from './keyEventMaps'; 
import nycCoordinates from './nycCoordinates'; 
import ALL_TYPES from './ALL_TYPES'; 
import DEFAULT_MAP_OPTIONS from './DEFAULT_MAP_OPTIONS'; 

const ANSWER_EVALUATION_DELAY 			= 6000;  // milliseconds 
const TWO_BLOCKS_BUTTON_CLASS 			= "two-blocks-button";  
const DEFAULT_MAP_ZOOM 					= 10; 
const DEFAULT_TOTAL_ROUNDS 				= 5; 
const HOVERED_BOROUGH_FILL_COLOR  		= "#A8FFFC";
const KEY_PRESS_DEBOUNCE_TIMEOUT 		= 100; 
const MAXIMUM_PANORAMA_REQUESTS  		= 25; 
const MAXIMUM_RANDOM_PANORAMA_ATTEMPTS  = 3; 
const MILES_PER_METER  					= 0.000621371; 
const NYC_BOUNDARIES_DATASET_URL  		= "https://data.cityofnewyork.us/api/views/6jcb-t2g6/rows.geojson"; 
const PANORAMA_LOAD_DELAY  				= 3000; 
const SELECTED_BOROUGH_FILL_COLOR 		= "#FFFFFF"; 
const WINDOW_RESIZE_DEBOUNCE_TIMEOUT 	= 100;

export { 
	events, 
	heardKeys, 
	keyEventMaps, 
	nycCoordinates, 
	ALL_TYPES,
	ANSWER_EVALUATION_DELAY, 
	DEFAULT_MAP_OPTIONS, 
	DEFAULT_MAP_ZOOM, 
	DEFAULT_TOTAL_ROUNDS,
	HOVERED_BOROUGH_FILL_COLOR, 
	KEY_PRESS_DEBOUNCE_TIMEOUT,
	MAXIMUM_PANORAMA_REQUESTS, 
	MAXIMUM_RANDOM_PANORAMA_ATTEMPTS, 
	MILES_PER_METER,  
	NYC_BOUNDARIES_DATASET_URL, 
	PANORAMA_LOAD_DELAY, 
	SELECTED_BOROUGH_FILL_COLOR, 
	TWO_BLOCKS_BUTTON_CLASS, 
	WINDOW_RESIZE_DEBOUNCE_TIMEOUT
}; 
