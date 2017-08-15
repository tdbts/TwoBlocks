import actionCreators from '../../../actions/action-creators/actionCreators';

export default dispatch => {

	return {

		submitBorough: () => dispatch(actionCreators.submitBorough())

	};

};
