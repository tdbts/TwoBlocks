import actionCreators from '../../actions/action-creators/actionCreators';

export default dispatch => {

	return {

		appInitialized: 			() => dispatch(actionCreators.appInitialized()),

		canEvaluateAnswer: 			() => dispatch(actionCreators.canEvaluateAnswer()),

		cannotEvaluateAnswer: 		() => dispatch(actionCreators.cannotEvaluateAnswer()),

		clearConsideredBorough:     () => dispatch(actionCreators.clearConsideredBorough()),

		clearCurrentTurn: 			() => dispatch(actionCreators.clearCurrentTurn()),

		clearRandomLocation: 		() => dispatch(actionCreators.clearRandomLocation()),

		clearSelectedBorough: 		() => dispatch(actionCreators.clearSelectedBorough()),

		confirmAnswer: 				() => dispatch(actionCreators.confirmAnswer()),

		cssLoaded: 					() => dispatch(actionCreators.cssLoaded()),

		gameComponentsCreated: 		() => dispatch(actionCreators.gameComponentsCreated()),

		gameOver: 					() => dispatch(actionCreators.gameOver()),

		geoJSONLoaded: 				() => dispatch(actionCreators.geoJSONLoaded()),

		incrementTotalRounds: 		() => dispatch(actionCreators.incrementTotalRounds()),

		librariesLoaded: 			() => dispatch(actionCreators.librariesLoaded()),

		nextTurn: 					() => dispatch(actionCreators.nextTurn()),

		requestRandomLocation: 		() => dispatch(actionCreators.requestRandomLocation()),

		restartGame: 				() => dispatch(actionCreators.restartGame()),

		saveTurn: 					turn => dispatch(actionCreators.saveTurn(turn)),

		setDesktopApp: 				() => dispatch(actionCreators.setDesktopApp()),

		setMobileApp: 				() => dispatch(actionCreators.setMobileApp()),

		setRandomLocation: 			randomLocation => dispatch(actionCreators.setRandomLocation(randomLocation)),

		stagePregame: 				() => dispatch(actionCreators.stagePregame()),

		stageLoadingPanorama: 		() => dispatch(actionCreators.stageLoadingPanorama()),

		stageShowingPanorama: 		() => dispatch(actionCreators.stageShowingPanorama()),

		stageGuessingLocation: 		() => dispatch(actionCreators.stageGuessingLocation()),

		stageEvaluatingAnswer: 		() => dispatch(actionCreators.stageEvaluatingAnswer()),

		stagePostgame: 				() => dispatch(actionCreators.stagePostgame()),

		startGame: 					() => dispatch(actionCreators.startGame()),

		throwError: 				e => dispatch(actionCreators.throwError(e)),

		viewComplete: 				() => dispatch(actionCreators.viewComplete())

	};

};
