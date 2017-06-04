import actions from '../../../actions/actions'; 

const canEvaluateAnswer = function canEvaluateAnswer(state = false, action) {

	switch (action.type) {

		case actions.CAN_EVALUATE_ANSWER:

			state = true;

			break;

		case actions.CANNOT_EVALUATE_ANSWER: 

			state = false;

			break;

	}

	return state;

}; 

export default canEvaluateAnswer; 
