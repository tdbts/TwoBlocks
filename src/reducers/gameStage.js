import actions from '../actions/actions';
import { gameStages } from '../constants/constants'; 

const gameStage = function gameStage(state = null, action) {

	let nextState = state; 

	const { type, stage } = action; 

	if (actions.SET_GAME_STAGE === type) {

		if (nextState === stage) return nextState;  // No change  

		nextState = stage;  // Set new game stage 

	} else if (actions.RESTART_GAME === type) {

		nextState = gameStages.PREGAME; 

	}

	return nextState; 

}; 

export default gameStage; 
