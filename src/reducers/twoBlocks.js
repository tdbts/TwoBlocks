import { combineReducers } from 'redux'; 
import currentTurn from './currentTurn';
import gameHistory from './gameHistory';  
import gameStage from './gameStage';  
import loading from './loading'; 
import mapLatLng from './mapLatLng'; 
import view from './view'; 

const twoBlocks = combineReducers({
	currentTurn,
	gameHistory,  
	gameStage, 
	loading, 
	mapLatLng, 
	view
}); 

export default twoBlocks; 
