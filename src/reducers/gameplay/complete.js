import actions from '../../actions/actions'; 

const complete = function complete(state = false, action) {

	switch (action.type) {

		case actions.GAME_OVER: 

			state = true;

			break;

		case actions.RESTART_GAME:
		case actions.START_GAME: 

			state = false;

			break;

	}

	return state;

}; 

export default complete; 
