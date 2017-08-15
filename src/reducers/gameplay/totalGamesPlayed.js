import actions from '../../actions/actions';

export default function totalGamesPlayed(state = 0, action) {

	switch (action.type) {

		case actions.START_GAME:
		case actions.RESTART_GAME:

			state += 1;

			break;

	}

	return state;

}
