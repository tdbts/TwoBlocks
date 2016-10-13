import { combineReducers } from 'redux'; 
import currentTurn from './currentTurn'; 
import gameStage from './gameStage';  
import mapLatLng from './mapLatLng'; 
import view from './view'; 

const twoBlocks = combineReducers({
	currentTurn, 
	gameStage, 
	mapLatLng, 
	view
}); 

export default twoBlocks; 
