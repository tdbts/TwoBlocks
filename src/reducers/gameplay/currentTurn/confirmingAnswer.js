import actions from '../../../actions/actions';

const confirmingAnswer = function confirmingAnswer(state = false, action) {

	switch (action.type) {

		case actions.CONFIRMING_ANSWER: 

			state = true;

			break;

		case actions.CLEAR_SELECTED_BOROUGH:
		case actions.SUBMIT_BOROUGH:

			state = false;

	}

	return state;

}; 

export default confirmingAnswer;
