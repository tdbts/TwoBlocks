import actions from '../../actions/actions';

const hoveredBorough = function hoveredBorough(state = null, action) {

	const { borough, type } = action;

	switch (type) {

		case actions.SET_HOVERED_BOROUGH: 

			state = borough;

			break;

		case actions.CLEAR_HOVERED_BOROUGH: 

			state = null;

			break;

	}

	return state;
	
}; 

export default hoveredBorough;
