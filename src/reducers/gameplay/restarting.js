import actions from '../../actions/actions';

export default (state = false, action) => {

	switch (action.type) {

		case actions.RESTART_GAME:

			state = true;

			break;

		case actions.NEXT_TURN:

			state = false;

			break;

	}

	return state;

};
