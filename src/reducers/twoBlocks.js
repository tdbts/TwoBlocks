import { combineReducers } from 'redux'; 
import canEvaluateAnswer from './canEvaluateAnswer'; 
import currentTurn from './currentTurn';
import gameHistory from './gameHistory';
import gameOver from './gameOver';   
import gameStage from './gameStage';  
import hasStarted from './hasStarted'; 
import loading from './loading';
import stageRequirements from './stageRequirements';  
import totalRounds from './totalRounds';  
import view from './view'; 
import viewReady from './viewReady'; 

const twoBlocks = combineReducers({
	canEvaluateAnswer, 
	currentTurn,
	gameHistory,  
	gameOver, 
	gameStage, 
	hasStarted, 
	loading, 
	stageRequirements, 
	totalRounds,  
	view, 
	viewReady
}); 

export default twoBlocks; 
