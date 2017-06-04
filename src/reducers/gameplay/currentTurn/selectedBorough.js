import actions from '../../../actions/actions';

const selectedBorough = function selectedBorough(state = '', action) {

	const { borough, type } = action;

	switch (type) {

		case actions.SET_SELECTED_BOROUGH: 

			state = borough;

			break;

		case actions.CLEAR_CONSIDERED_BOROUGH:

			state = '';

			break;

	}

	return state;

}; 

export default selectedBorough;
