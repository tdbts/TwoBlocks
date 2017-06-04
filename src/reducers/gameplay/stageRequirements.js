import actions from '../../actions/actions';

const stageRequirements = function stageRequirements(state = [], action) {

	const { index, requirement, requirements } = action;

	switch (action.type) {

		case actions.ADD_STAGE_REQUIREMENT:

			state = state.concat([requirement]);

			break;

		case actions.ADD_STAGE_REQUIREMENTS: 

			state = state.concat(requirements);

			break;

		case actions.CLEAR_STAGE_REQUIREMENTS:

			state = [];

			break;

		case actions.REMOVE_STAGE_REQUIREMENT:

			// const index = state.indexOf(requirement);

			if (index > -1) {

				state = state.slice(0, index).concat(state.slice(index + 1));
			
			}
	
			break;

	}

	return state;

}; 

export default stageRequirements; 
