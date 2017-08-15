import actions from '../actions/actions'; 

const canEvaluateAnswer = function canEvaluateAnswer(state = false, action) {

	let nextState = state; 

	const { type } = action; 

	if (actions.SUBMIT_BOROUGH === type) {

		nextState = true; 

	} else if (actions.CANNOT_EVALUATE_ANSWER === type) {

		nextState = false; 

	}

	return nextState; 

}; 

export default canEvaluateAnswer; 
