import { combineReducers } from 'redux'; 
import gameStage from './gameStage';  
import mapLatLng from './mapLatLng'; 

const twoBlocks = combineReducers({
	gameStage, 
	mapLatLng
}); 

export default twoBlocks; 
