import actions from '../actions/actions'; 

const view = function view(state = 'map', action) {

	let nextState = state; 

	const { type } = action; 

	if (actions.SHOW_PANORAMA === type) {

		nextState = 'panorama'; 

	} else if (actions.SHOW_MAP === type) {

		nextState = 'map'; 

	}

	return nextState; 

}; 

export default view; 
