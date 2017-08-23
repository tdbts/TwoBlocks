import actions from '../../actions/actions';

export default (state = null, action) => {

	const { type, error } = action;

	switch (type) {

		case actions.THROW_ERROR:

			state = error;

			break;

	}

	return state;

};
