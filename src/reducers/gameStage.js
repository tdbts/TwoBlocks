import actions from '../actions/actions';

const gameStage = function gameStage(state = 'pregame', action) {

	let nextState = state; 

	const { type, stage } = action; 

	if (actions.SET_GAME_STAGE === type) {

		if (nextState === stage) return nextState;  // No change  

		nextState = stage;  // Set new game stage 

	} else if (actions.RESTART_GAME === type) {

		nextState = 'pregame'; 

	}

	return nextState; 

}; 

export default gameStage; 
