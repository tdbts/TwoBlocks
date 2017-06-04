import actions from '../../actions/actions';

const showingLocation = function showingLocation(state = false, action) {

	switch (action.type) {

		case actions.SHOW_LOCATION:

			state = true;

			break;

		case actions.STOP_SHOWING_LOCATION:

			state = false;

			break;

	}

	return state;

}; 

export default showingLocation;
