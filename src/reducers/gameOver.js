import actions from '../actions/actions'; 

const gameOver = function gameOver(state = false, action) {

	let nextState = state; 

	const { type } = action; 

	if (actions.GAME_OVER === type) {

		nextState = true; 

	}

	return nextState; 

}; 

export default gameOver; 

