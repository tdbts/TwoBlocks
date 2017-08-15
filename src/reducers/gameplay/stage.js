import actions from '../../actions/actions';
import { gameStages } from '../../constants/constants';

export default (state = null, action) => {

	switch (action.type) {

		case actions.STAGE_EVALUATING_ANSWER:

			state = gameStages.EVALUATING_ANSWER;

			break;

		case actions.STAGE_GUESSING_LOCATION:

			state = gameStages.GUESSING_LOCATION;

			break;

		case actions.STAGE_LOADING_PANORAMA:

			state = gameStages.LOADING_PANORAMA;

			break;

		case actions.STAGE_POSTGAME:

			state = gameStages.POSTGAME;

			break;

		case actions.STAGE_PREGAME:

			state = gameStages.PREGAME;

			break;

		case actions.STAGE_SHOWING_PANORAMA:

			state = gameStages.SHOWING_PANORAMA;

			break;

	}

	return state;

}; 
