import actionCreators from '../../../../actions/action-creators/actionCreators';

export default dispatch => {

	return {

		clearSelectedBorough: () => dispatch(actionCreators.clearSelectedBorough()),
		
		submitBorough: () => dispatch(actionCreators.submitBorough())

	};

};
