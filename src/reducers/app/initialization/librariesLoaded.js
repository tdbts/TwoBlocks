import actions from '../../../actions/actions';

const librariesLoaded = function librariesLoaded(state = false, action) {

	switch (action.type) {

		case actions.LIBRARIES_LOADED: 

			state = true;

			break;

	}

	return state;

}; 

export default librariesLoaded;
