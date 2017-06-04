import actions from '../../actions/actions';

const initialized = function initialized(state = false, action) {

	switch (action.type) {

		case actions.APP_INITIALIZED:

			state = true;

			break;

	}

	return state;

}; 

export default initialized;
