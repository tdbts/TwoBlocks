import actionCreators from '../../../../actions/action-creators/actionCreators';

export default dispatch => {

	return {

		setSelectedBorough: borough => dispatch(actionCreators.setSelectedBorough(borough))

	};

};
