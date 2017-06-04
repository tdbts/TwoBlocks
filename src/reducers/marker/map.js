import actions from '../../actions/actions';

export default (state = null, action) => {

	const { map, type } = action;

	switch (type) {

		case actions.CLEAR_MARKER_MAP: 

			state = null;

			break;

		case actions.SET_MARKER_MAP:

			state = map;

			break;

	}

	return state;

}; 
