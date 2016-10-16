import actions from '../actions/actions'; 

const DEFAULT_STATE = false; 

const gameOver = function gameOver(state = DEFAULT_STATE, action) {

	let nextState = state; 

	const { type } = action; 

	if (actions.GAME_OVER === type) {

		nextState = true; 

	} else if (actions.RESTART_GAME === type) {

		nextState = DEFAULT_STATE; 

	} else if (actions.START_GAME) {

		nextState = false; 
		
	}

	return nextState; 

}; 

export default gameOver; 

