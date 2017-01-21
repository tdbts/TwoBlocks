import actions from '../actions/actions'; 

const hasStarted = function hasStarted(state = false, action) {

	let nextState = state; 

	const { type } = action; 

	if (actions.START_GAME === type) {

		nextState = true; 

	}

	return nextState; 

}; 

export default hasStarted; 
