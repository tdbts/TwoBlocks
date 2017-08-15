import actionCreators from '../../actions/action-creators/actionCreators';

export default dispatch => {

	return {

		displayLocation: () => dispatch(actionCreators.displayLocation()),

		hidePanorama: () => dispatch(actionCreators.hidePanorama()),

		panoramaCreated: () => dispatch(actionCreators.panoramaCreated()),

		setCountdownTime: time => dispatch(actionCreators.setCountdownTime(time)),

		showPanorama: () => dispatch(actionCreators.showPanorama()),

		startCountdown: time => dispatch(actionCreators.startCountdown(time)),

		stopDisplayingLocation: () => dispatch(actionCreators.stopDisplayingLocation()),

		stopShowingPanorama: () => dispatch(actionCreators.stopShowingPanorama())

	};

};
