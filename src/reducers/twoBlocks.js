import { combineReducers } from 'redux'; 
import currentTurn from './currentTurn';
import gameHistory from './gameHistory';
import gameOver from './gameOver';   
import gameStage from './gameStage';  
import loading from './loading'; 
import mapLatLng from './mapLatLng'; 
import view from './view'; 

const twoBlocks = combineReducers({
	currentTurn,
	gameHistory,  
	gameOver, 
	gameStage, 
	loading, 
	mapLatLng, 
	view
}); 

export default twoBlocks; 
