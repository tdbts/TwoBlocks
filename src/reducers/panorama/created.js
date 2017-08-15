import actions from '../../actions/actions';

const created = function created(state = false, action) {

	switch (action.type) {

		case actions.PANORAMA_CREATED: 

			state = true;

			break;

	}

	return state;

}; 

export default created;
