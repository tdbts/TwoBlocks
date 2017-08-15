import actionCreators from '../../actions/action-creators/actionCreators';

export default dispatch => {

	return {

		clearHoveredBorough: () => dispatch(actionCreators.clearHoveredBorough()),

		clearConsideredBorough: () => dispatch(actionCreators.clearConsideredBorough()),

		hideMap: () => dispatch(actionCreators.hideMap()),

		onMapsCreated: () => dispatch(actionCreators.mapsCreated()),

		restartGame: () => dispatch(actionCreators.restartGame()),

		setConsideredBorough: borough => dispatch(actionCreators.setConsideredBorough(borough)),

		setHoveredBorough: borough => dispatch(actionCreators.setHoveredBorough(borough)),

		setMapLevelBlock: () => dispatch(actionCreators.setMapLevelBlock()),

		setMapLevelBorough: () => dispatch(actionCreators.setMapLevelBorough()),

		setMapLevelCity: () => dispatch(actionCreators.setMapLevelCity()),

		setSelectedBorough: borough => dispatch(actionCreators.setSelectedBorough(borough)),

		showAnswer: () => dispatch(actionCreators.showAnswer()),

		showMap: () => dispatch(actionCreators.showMap()),

		stopShowingAnswer: () => dispatch(actionCreators.stopShowingAnswer()),

		submitBorough: () => dispatch(actionCreators.submitBorough())
	
	};

};
