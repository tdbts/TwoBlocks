import actions from '../actions/actions'; 
import { isType } from '../utils/utils'; 

const currentTurn = function currentTurn(state = null, action) {

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

	}

	return nextState; 

}; 

export default currentTurn; 
