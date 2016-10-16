import actions from '../actions/actions'; 

const DEFAULT_STATE = 0; 

const totalRounds = function totalRounds(state = DEFAULT_STATE, action) {

	let nextState = state; 

	const { type } = action; 

	if (actions.INCREMENT_TOTAL_ROUNDS === type) {

		nextState = state + 1; 

	} else if (actions.RESTART_GAME === type) {

		nextState = DEFAULT_STATE; 

	}

	return nextState; 

}; 

export default totalRounds; 
