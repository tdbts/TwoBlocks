import actions from '../../../actions/actions';

const gameComponentsStarted = function gameComponentsStarted(state = false, action) {

	switch (action.type) {

		case actions.GAME_COMPONENTS_STARTED:

			state = true;

			break;

	}

	return state;

}; 

export default gameComponentsStarted;
