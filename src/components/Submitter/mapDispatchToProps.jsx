import actionCreators from '../../actions/action-creators/actionCreators';

export default function mapDispatchToProps(dispatch) {

	return {

		submitBorough: () => dispatch(actionCreators.submitBorough())

	};

}
