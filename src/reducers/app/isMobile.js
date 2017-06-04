import actions from '../../actions/actions';

const isMobile = function isMobile(state = null, action) {

	switch (action.type) {

		case actions.SET_MOBILE_APP: 

			state = true;

			break;

		case actions.SET_DESKTOP_APP:

			state = false;

			break;

	}

	return state;

}; 

export default isMobile;
