import actions from '../../../actions/actions';

const geoJSONLoaded = function geoJSONLoaded(state = false, action) {

	switch (action.type) {

		case actions.GEO_JSON_LOADED: 

			state = true;

			break;

	}

	return state;

}; 

export default geoJSONLoaded;
