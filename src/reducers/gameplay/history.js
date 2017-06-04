import actions from '../../actions/actions'; 

const history = function history(state = [], action) {

	const { turn, type } = action;
	
	switch (type) {

		case actions.SAVE_TURN:

			state = state.concat(turn);

			break;

		case actions.RESTART_GAME: 

			state = [];

			break;
	}

	return state;

}; 

export default history; 
