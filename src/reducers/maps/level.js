import actions from '../../actions/actions';

export default function level(state = 'city', action) {

	switch (action.type) {

		case actions.SET_MAP_LEVEL_BLOCK: 

			state = 'block';

			break;

		case actions.SET_MAP_LEVEL_BOROUGH: 

			state = 'borough';

			break;

		case actions.SET_MAP_LEVEL_CITY: 

			state = 'city';

			break;

	}

	return state;

}
