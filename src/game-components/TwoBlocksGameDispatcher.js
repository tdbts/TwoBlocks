import actions from '../actions/actions';  

const TwoBlocksGameDispatcher = function TwoBlocksGameDispatcher(store) {

	this.actions = actions; 
	this.store = store; 

}; 

TwoBlocksGameDispatcher.prototype = {

	addStageRequirements(requirements) {

		this.store.dispatch({
			requirements, 
			type: actions.ADD_STAGE_REQUIREMENTS
		}); 

	}, 

	canEvaluateAnswer() {

		this.store.dispatch({
			type: actions.CAN_EVALUATE_ANSWER
		}); 

	}, 

	cannotEvaluateAnswer() {

		this.store.dispatch({
			type: actions.CANNOT_EVALUATE_ANSWER 
		}); 

	}, 

	clearCurrentTurn() {

		this.store.dispatch({
			type: actions.CLEAR_CURRENT_TURN
		}); 

	}, 

	clearStageRequirements() {

		this.store.dispatch({
			type: actions.CLEAR_STAGE_REQUIREMENTS
		}); 

	}, 

	gameOver() {

		this.store.dispatch({
			type: this.actions.GAME_OVER
		}); 		

	}, 

	incrementTotalRounds() {

		this.store.dispatch({
			type: actions.INCREMENT_TOTAL_ROUNDS
		}); 

	}, 

	nextTurn(turn) {
		
		this.store.dispatch({
			turn,
			type: actions.NEXT_TURN
		}); 

	}, 

	restartGame() {

		this.store.dispatch({
			type: actions.RESTART_GAME
		}); 

	}, 

	saveTurn(turn) {

		this.store.dispatch({
			turn, 
			type: this.actions.SAVE_TURN
		}); 		

	}, 

	setGameStage(stage) {

		this.store.dispatch({
			stage, 
			type: actions.SET_GAME_STAGE
		}); 

	}, 

	setTurnLocationData(turn) {

		this.store.dispatch({
			turn, 
			type: actions.SET_TURN_LOCATION_DATA
		}); 

	}, 

	startGame() {

		this.store.dispatch({
			type: actions.START_GAME
		}); 

	}

}; 

export default TwoBlocksGameDispatcher; 
