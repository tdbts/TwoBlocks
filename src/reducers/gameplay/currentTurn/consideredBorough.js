import actions from '../../../actions/actions';

const consideredBorough = function consideredBorough(state = null, action) {

	const { borough, type } = action;

	switch (type) {

		case actions.SET_CONSIDERED_BOROUGH:

			state = borough;

			break;

		case actions.CLEAR_CONSIDERED_BOROUGH:

			state = null;

			break;

	}

	return state;

}; 

export default consideredBorough;
