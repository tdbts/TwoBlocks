import actions from '../../actions/actions';

const randomLocation = function randomLocation(state = null, action) {

	const { lat, lng, borough, type } = action;

	switch (type) {

		case actions.SET_RANDOM_LOCATION: 

			state = { lat, lng, borough };

			break;

		case actions.CLEAR_RANDOM_LOCATION:

			state = null;

			break;

	}

	return state;

}; 

export default randomLocation;
