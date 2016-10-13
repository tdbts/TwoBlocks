import actions from '../actions/actions'; 

const view = function view(state = 'map', action) {

	let nextState = state; 

	const { type, viewState } = action; 

	if (actions.CHANGE_VIEW === type) {

		if (viewState !== nextState) {

			nextState = viewState; 

		}

	}

	return nextState; 

}; 

export default view; 
