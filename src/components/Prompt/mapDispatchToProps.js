import actionCreators from '../../actions/action-creators/actionCreators';

export default dispatch => {

	return {

		showPrompt: () => dispatch(actionCreators.showPrompt()),

		stopShowingPrompt: () => dispatch(actionCreators.stopShowingPrompt())

	};

};
