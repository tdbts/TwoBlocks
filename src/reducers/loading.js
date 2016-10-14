import actions from '../actions/actions'; 

const loading = function loading(state = true, action) {

	let nextState = state; 

	const { loadState, type } = action; 

	if (actions.SET_LOAD_STATE === type) {

		nextState = loadState; 

	}

	return nextState; 

}; 

export default loading; 
