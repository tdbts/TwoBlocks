import { combineReducers } from 'redux'; 
import app from './app/app';
import countdown from './countdown/countdown';
import gameplay from './gameplay/gameplay';
import interchange from './interchange/interchange';
import maps from './maps/maps';
import marker from './marker/marker';
import panorama from './panorama/panorama';
// import canEvaluateAnswer from './canEvaluateAnswer'; 
// import currentTurn from './currentTurn';
// import gameHistory from './gameHistory';
// import gameOver from './gameOver';   
// import gameStage from './gameStage';  
// import hasStarted from './hasStarted'; 
// import loading from './loading';
// import stageRequirements from './stageRequirements';  
// import totalRounds from './totalRounds';  
// import view from './view'; 

const twoBlocks = combineReducers({
	app,
	countdown,
	gameplay,
	interchange,
	maps,
	marker,
	panorama
	// canEvaluateAnswer, 
	// currentTurn,
	// gameHistory,  
	// gameOver, 
	// gameStage, 
	// hasStarted, 
	// loading, 
	// stageRequirements, 
	// totalRounds,  
	// view
}); 

export default twoBlocks; 
