import actions from '../actions/actions';

const gameStage = function gameStage(state = 'pregame', action) {

	let nextState = state; 

	const { type, stage } = action; 

	if (actions.SET_GAME_STAGE !== type) return nextState;  // Wrong action

	if (nextState === stage) return nextState;  // No change  

	nextState = stage;  // Set new game stage 

	return nextState; 

}; 

export default gameStage; 
