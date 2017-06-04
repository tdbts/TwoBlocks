const createVisibilityReducer = function createVisibilityReducer(showAction, hideAction, defaultState = false) {

	return (state = defaultState, action) => {

		switch (action.type) {

			case showAction:

				state = true;

				break;

			case hideAction:

				state = false;

				break;

		}

		return state;

	};

}; 

export default createVisibilityReducer;
