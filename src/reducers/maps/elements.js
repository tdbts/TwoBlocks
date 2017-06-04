import actions from '../../actions/actions';

const elements = function elements(state = [], action) {

	const { element, level, type } = action;

	switch (type) {

		case actions.MAP_ELEMENT_MOUNTED:

			state = state.concat([{ element, level }]);

			break;

	}

	return state;

}; 

export default elements; 
