import actions from '../../actions/actions';
import { lifecycle } from '../../constants/constants';

const { BEFORE, DURING, AFTER } = lifecycle;

export default (state = BEFORE, action) => {

	switch (action.type) {

		case actions.REQUEST_RANDOM_LOCATION:

			state = DURING;

			break;

		case actions.SET_RANDOM_LOCATION:

			state = AFTER;

			break;

		case actions.STAGE_LOADING_PANORAMA:

			state = BEFORE;

			break;

	}

	return state;

};
