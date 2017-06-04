import actions from '../../../actions/actions';

const domElementsMounted = function domElementsMounted(state = false, action) {

	switch (action.type) {

		case actions.DOM_ELEMENTS_MOUNTED:

			state = true;

			break;

	}

	return state;

}; 

export default domElementsMounted;
