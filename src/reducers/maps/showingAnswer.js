import actions from '../../actions/actions';
import { lifecycle } from '../../constants/constants';

const { BEFORE, DURING, AFTER } = lifecycle;

export default function showingAnswer(state = BEFORE, action) {

	switch (action.type) {

		case actions.STAGE_LOADING_PANORAMA:

			state = BEFORE;

			break;

		case actions.SHOW_ANSWER:

			state = DURING;

			break;

		case actions.STOP_SHOWING_ANSWER:

			state = AFTER;

			break;

	}

	return state;

}
