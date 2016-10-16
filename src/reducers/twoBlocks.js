import { combineReducers } from 'redux'; 
import canEvaluateAnswer from './canEvaluateAnswer'; 
import currentTurn from './currentTurn';
import gameHistory from './gameHistory';
import gameOver from './gameOver';   
import gameStage from './gameStage';  
import loading from './loading'; 
import totalRounds from './totalRounds';  
import view from './view'; 

const twoBlocks = combineReducers({
	canEvaluateAnswer, 
	currentTurn,
	gameHistory,  
	gameOver, 
	gameStage, 
	loading, 
	totalRounds,  
	view
}); 

export default twoBlocks; 
