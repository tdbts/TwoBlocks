import actions from '../actions/actions';

const DEFAULT_STATE = []; 

const stageRequirements = function stageRequirements(state = DEFAULT_STATE, action) {

	let nextState = state; 

	const { type } = action; 

	if (actions.ADD_STAGE_REQUIREMENT === type) {

		const { requirement } = action; 

		nextState = state.concat([requirement]); 

	} else if (actions.ADD_STAGE_REQUIREMENTS === type) {

		const { requirements } = action; 

		nextState = state.concat(requirements); 

	} else if (actions.CLEAR_STAGE_REQUIREMENTS === type) {

		nextState = DEFAULT_STATE; 

	} else if (actions.REMOVE_STAGE_REQUIREMENT === type) {

		const { index } = action; 

		nextState = state.slice(0, index).concat(state.slice(index + 1)); 

	}

	return nextState; 

}; 

export default stageRequirements; 
