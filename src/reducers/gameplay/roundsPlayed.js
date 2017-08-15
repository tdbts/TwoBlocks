import actions from '../../actions/actions'; 

const roundsPlayed = function roundsPlayed(state = 0, action) {

	switch (action.type) {

		case actions.INCREMENT_TOTAL_ROUNDS: 

			state += 1;

			break;

		case actions.RESTART_GAME: 

			state = 0;

			break;

	}

	return state;

}; 

export default roundsPlayed; 
