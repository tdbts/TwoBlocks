import actions from '../../../actions/actions';

export default (state = null, action) => {

	const { randomLocation, type } = action;

	switch (type) {

		case actions.SET_RANDOM_LOCATION: 

			state = randomLocation;

			break;

		case actions.CLEAR_CURRENT_TURN:
		case actions.CLEAR_RANDOM_LOCATION:

			state = null;

			break;

	}

	return state;

}; 
