import actions from '../../../actions/actions';

export default (state = false, action) => {

	switch (action.type) {

		case actions.CSS_LOADED:

			state = true;

			break;

	}

	return state;

};
