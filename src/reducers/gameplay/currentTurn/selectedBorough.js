import actions from '../../../actions/actions';

const selectedBorough = function selectedBorough(state = null, action) {

	const { borough, type } = action;

	switch (type) {

		case actions.SET_SELECTED_BOROUGH: 

			state = borough;

			break;

		case actions.CLEAR_CURRENT_TURN:
		case actions.CLEAR_SELECTED_BOROUGH:

			state = null;

			break;

	}

	return state;

}; 

export default selectedBorough;
