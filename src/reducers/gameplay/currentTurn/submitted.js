import actions from '../../../actions/actions';

const submitted = function submitted(state = false, action) {

	switch (action.type) {

		case actions.SUBMIT_BOROUGH:

			state = true;

			break;

		case actions.GAME_OVER:
		case actions.NEXT_TURN:
		case actions.RESTART_GAME:

			state = false;

			break;


	}

	return state;

};

export default submitted;
