import actions from '../../actions/actions';
import { lifecycle } from '../../constants/constants';

const { BEFORE, DURING, AFTER } = lifecycle;

const displayingLocation = function displayingLocation(state = BEFORE, action) {

	switch (action.type) {

		case actions.STAGE_LOADING_PANORAMA:

			state = BEFORE;

			break;

		case actions.DISPLAY_LOCATION:

			state = DURING;

			break;

		case actions.STOP_DISPLAYING_LOCATION:

			state = AFTER;

			break;

	}

	return state;

}; 

export default displayingLocation;
