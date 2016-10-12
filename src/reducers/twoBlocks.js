import { combineReducers } from 'redux'; 
import currentTurn from './currentTurn'; 
import gameStage from './gameStage';  
import mapLatLng from './mapLatLng'; 

const twoBlocks = combineReducers({
	currentTurn, 
	gameStage, 
	mapLatLng
}); 

export default twoBlocks; 
