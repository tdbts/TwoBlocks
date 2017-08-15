import actions from '../../../actions/actions';

const gameComponentsCreated = function gameComponentsCreated(state = false, action) {

	switch (action.type) {

		case actions.GAME_COMPONENTS_CREATED:

			state = true;

			break;

	}

	return state;

}; 

export default gameComponentsCreated;
