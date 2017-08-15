import actions from '../../actions/actions';
import { lifecycle } from '../../constants/constants';

const { BEFORE, DURING, AFTER } = lifecycle;

const displaying = function displaying(state = BEFORE, action) {

	switch (action.type) {

		case actions.SHOW_PROMPT:

			state = DURING;

			break;

		case actions.STOP_SHOWING_PROMPT:

			state = AFTER;

			break;

		case actions.STAGE_PREGAME:
		case actions.STAGE_LOADING_PANORAMA:
		case actions.STAGE_SHOWING_PANORAMA:
		case actions.STAGE_GUESSING_LOCATION:
		case actions.STAGE_EVALUATING_ANSWER:
		case actions.STAGE_POSTGAME:

			state = BEFORE;

			break;

	}

	return state;

};

export default displaying;
