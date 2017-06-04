import actions from '../../../actions/actions';

const submittedBorough = function submittedBorough(state = '', action) {

	const { borough, type } = action;

	switch (type) {

		case actions.SUBMIT_BOROUGH:

			state = borough;

			break;

	}

	return state;

}; 

export default submittedBorough;
