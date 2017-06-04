import actions from '../../actions/actions';

const level = function level(state = 'CITY', action) {

	switch (action.type) {

		case actions.SHOW_BLOCK_LEVEL_MAP: 

			state = 'BLOCK';

			break;

		case actions.SHOW_BOROUGH_LEVEL_MAP: 

			state = 'BOROUGH';

			break;

		case actions.SHOW_CITY_LEVEL_MAP: 

			state = 'CITY';

			break;

	}

	return state;

}; 

export default level;
