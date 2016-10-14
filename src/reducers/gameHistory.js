import actions from '../actions/actions'; 

const DEFAULT_STATE = []; 

const gameHistory = function gameHistory(state = DEFAULT_STATE, action) {

	let nextState = state; 

	const { type, turn } = action; 

	if (actions.SAVE_TURN === type) {

		nextState = nextState.concat(turn); 

	} else if (actions.RESTART_GAME === type) {

		nextState = DEFAULT_STATE; 

	}

	return nextState; 

}; 

export default gameHistory; 
