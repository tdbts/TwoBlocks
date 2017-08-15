import actions from '../../actions/actions';

const complete = function complete(state = false, action) {

	switch (action.type) {

		case actions.VIEW_COMPLETE:

			state = true;

			break;

		// Every new stage requires that the view complete its task 
		// and notify the application.
		
		case actions.STAGE_EVALUATING_ANSWER:
		case actions.STAGE_GUESSING_LOCATION:
		case actions.STAGE_LOADING_PANORAMA:
		case actions.STAGE_POSTGAME:
		case actions.STAGE_PREGAME:
		case actions.STAGE_SHOWING_PANORAMA:

			state = false;

			break;

	}

	return state;

}; 

export default complete;
