import actions from '../../actions/actions';

const timeLeft = function timeLeft(state = null, action) {

	const { time, type } = action;

	switch (type) {

		case actions.START_COUNTDOWN: 
		case actions.SET_COUNTDOWN_TIME:

			state = time;

			break;
			
	}

	return state;

}; 

export default timeLeft;
