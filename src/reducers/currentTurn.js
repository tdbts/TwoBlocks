import actions from '../actions/actions'; 
import { isType } from '../utils/utils'; 

const DEFAULT_STATE = null; 

const currentTurn = function currentTurn(state = DEFAULT_STATE, action) {

	let nextState = state; 

	const { type, turn, selectedBorough } = action; 

	if (actions.CLEAR_CURRENT_TURN === type) {

		nextState = null; 

	} else if (actions.NEW_CURRENT_TURN === type) {

		nextState = turn; 

	} else if (actions.BOROUGH_SELECTED === type) {

		if (isType('object', nextState)) {

			nextState = Object.assign(nextState, { selectedBorough }); 

		} 

	} else if (actions.RESTART_GAME === type) {

		nextState = DEFAULT_STATE; 
		
	}

	return nextState; 

}; 

export default currentTurn; 
