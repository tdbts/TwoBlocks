import actionCreators from '../../actions/action-creators/actionCreators';

export default dispatch => {

	return {

		onButtonClick: () => dispatch(actionCreators.restartGame())

	};

};
