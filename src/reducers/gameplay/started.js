import actions from '../../actions/actions'; 

const started = function started(state = false, action) {

	switch (action.type) {

		case actions.START_GAME:

			state = true;

			break;
	
	}

	return state;

}; 

export default started; 
