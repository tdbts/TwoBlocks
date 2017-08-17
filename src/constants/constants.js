import boroughNames from './boroughNames'; 
import gameStages from './gameStages'; 
import heardKeys from './heardKeys'; 
import keyEventMaps from './keyEventMaps';
import lifecycle from './lifecycle';
import nycLocationData from './nycLocationData';
import transitionTypes from './transitionTypes'; 
import workerMessages from './workerMessages';  

const DEFAULT_MAXIMUM_ROUNDS 			= 1;
const KEY_PRESS_DEBOUNCE_TIMEOUT 		= 100; 
const MAXIMUM_EVENT_EMITTER_LISTENERS	= 50; 
const MAXIMUM_PANORAMA_REQUESTS  		= 5; 
const MAXIMUM_RANDOM_PANORAMA_ATTEMPTS  = 3; 
const MILLISECONDS_PER_SECOND 			= 1000;  
const MINIMUM_SPINNER_SCREEN_WIDTH 		= 737;  
const WINDOW_RESIZE_DEBOUNCE_TIMEOUT 	= 100;

export { 
	boroughNames,
	gameStages, 
	heardKeys, 
	keyEventMaps,
	lifecycle, 
	nycLocationData,
	transitionTypes, 
	workerMessages, 
	DEFAULT_MAXIMUM_ROUNDS, 
	KEY_PRESS_DEBOUNCE_TIMEOUT,
	MAXIMUM_EVENT_EMITTER_LISTENERS, 
	MAXIMUM_PANORAMA_REQUESTS, 
	MAXIMUM_RANDOM_PANORAMA_ATTEMPTS, 
	MILLISECONDS_PER_SECOND, 
	MINIMUM_SPINNER_SCREEN_WIDTH,   
	WINDOW_RESIZE_DEBOUNCE_TIMEOUT
}; 
