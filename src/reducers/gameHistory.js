import actions from '../actions/actions'; 

const gameHistory = function gameHistory(state = [], action) {

	let nextState = state; 

	const { type, turn } = action; 

	if (actions.SAVE_TURN === type) {

		nextState = nextState.concat(turn); 

	}

	return nextState; 

}; 

export default gameHistory; 
