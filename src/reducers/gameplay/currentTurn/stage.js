import actions from '../../../actions/actions';

export default (state = null, action) => {

	const { stage, type } = action;

	switch (type) {

		case actions.SET_GAME_STAGE:

			state = stage;

			break;

	}

	return state;

}; 
