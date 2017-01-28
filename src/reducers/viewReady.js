import actions from '../actions/actions';

const DEFAULT_STATE = false; 

const viewReady = function viewReady(state = DEFAULT_STATE, action) {

	let nextState = state; 

	const { type } = action; 

	if (actions.SET_GAME_STAGE === type) {

		nextState = false; 

	} else if (actions.VIEW_READY === type) {

		nextState = true; 

	}

	return nextState; 

}; 

export default viewReady; 
