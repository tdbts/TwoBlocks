/* global window */
   
import actions from './actions/actions'; 
import { EventEmitter } from 'events'; 
import { inherits } from 'util';
import { createPromiseTimeout } from './utils/utils'; 
import { events, gameStages, nycCoordinates, ANSWER_EVALUATION_DELAY, DEFAULT_MAXIMUM_ROUNDS, MAXIMUM_RANDOM_PANORAMA_ATTEMPTS } from './constants/constants';   

const TwoBlocksGame = function TwoBlocksGame(store, worker, service) {

	this.events = events; 
	this.store = store;   
	this.worker = worker; 
	this.service = service; 
	this.locationData = {}; 

	this._geoJSONLoaded = new Promise(resolve => this.once(events.GEO_JSON_LOADED, resolve)); 

	/*=================================
	=            DEBUGGING            =
	=================================*/

	const logEvent = function logEvent(event) {
	
		return payload => {

			window.console.log("event:", event); 

			if (payload) {

				window.console.log("payload:", payload); 
			
			}

		}; 
	
	}; 
	
	
	for (const event in this.events) {

		this.on(event, logEvent(event)); 

	}
	
	/*=====  End of DEBUGGING  ======*/

}; 
	
/*----------  Inherit from EventEmitter  ----------*/

inherits(TwoBlocksGame, EventEmitter); 

/*----------  Define TwoBlocksGame Prototype  ----------*/

TwoBlocksGame.prototype = Object.assign(TwoBlocksGame.prototype, {

	addEventListeners() {

		this.on(this.events.GEO_JSON_LOADED, geoJSON => this.onGeoJSONLoaded(geoJSON)); 

		this.on(this.events.GAME_STAGE, gameStage => this.onGameStage(gameStage)); 

		this.on(this.events.VIEW_COMPLETE, () => this.onViewComplete()); 

		this.on(this.events.GUESSING_LOCATION, () => this.onGuessingLocation()); 

		this.on(this.events.ANSWER_EVALUATED, answerDetails => this.onAnswerEvaluated(answerDetails)); 

		this.on(this.events.TURN_COMPLETE, () => this.onTurnComplete()); 

		this.on(this.events.GAME_OVER, () => this.onGameOver()); 

		this.on(this.events.RESTART_GAME, () => this.restart()); 

	},

	addTurnToGameHistory() {

		const { currentTurn } = this.store.getState(); 

		this.store.dispatch({
			turn: currentTurn, 
			type: actions.SAVE_TURN
		}); 

	}, 

	endGame() {

		const stage = gameStages.POSTGAME; 

		this.setStageRequirements(stage); 

		this.store.dispatch({
			stage, 
			type: actions.SET_GAME_STAGE
		});

		this.store.dispatch({
			type: actions.GAME_OVER
		}); 

		this.emit(this.events.GAME_OVER); 

	}, 

	evaluateAnswer() {

		const stage = gameStages.EVALUATING_ANSWER; 

		this.setStageRequirements(stage); 

		this.store.dispatch({
			stage, 
			type: actions.SET_GAME_STAGE
		}); 

		this.emit(this.events.GAME_STAGE, {
			stage, 
			previousStage: gameStages.LOADING_PANORAMA
		}); 

		const { canEvaluateAnswer, currentTurn } = this.store.getState(); 

		const { selectedBorough, boroughName: correctBorough } = currentTurn; 

		if (!(canEvaluateAnswer)) return; 

		this.store.dispatch({
			type: actions.CANNOT_EVALUATE_ANSWER  // Don't allow answer evaluation until the next turn
		}); 

		if (selectedBorough === correctBorough) {

			this.emit(this.events.CORRECT_BOROUGH, correctBorough);  
		
		} else {

			this.emit(this.events.INCORRECT_BOROUGH, { correctBorough, selectedBorough });  

		}

		const { randomLatLng } = this.store.getState().currentTurn;  

		this.emit(this.events.ANSWER_EVALUATED, { correctBorough, randomLatLng, selectedBorough }); 

		return this.readyForNextStage(); 

	}, 

	gameOver() {

		return this.store.getState().gameOver; 
	
	},

	getGeoJSONSourceURL() {

		return Promise.resolve(nycCoordinates)

			.then(locationData => this.onCityLocationDataReceived(locationData)); 

	},

	geoJSONLoaded() {

		return this._geoJSONLoaded; 

	}, 

	getRandomPanoramaLocation(featureCollection, attemptsLeft = MAXIMUM_RANDOM_PANORAMA_ATTEMPTS) {
		
		return this.service.getRandomPanoramaLocation(featureCollection) 

			.catch(() => {

				if (attemptsLeft === 0) {

					throw new Error("Attempts to request a random Google Street View failed too many times.  Check your internet connection."); 

				}

				attemptsLeft = attemptsLeft - 1; 

				window.console.log(`Failure to request nearest panorama.  ${attemptsLeft} more attempts left.`); 

				return this.getRandomPanoramaLocation(featureCollection, attemptsLeft); 

			}) 						

			.then(randomLocationDetails => {
				
				const { randomLatLng } = randomLocationDetails; 

				window.console.log("randomLatLng:", randomLatLng); 

				return randomLocationDetails; 

			}); 

	}, 

	guessLocation() {

		const stage = gameStages.GUESSING_LOCATION; 

		this.setStageRequirements(stage); 

		this.store.dispatch({
			stage, 
			type: actions.SET_GAME_STAGE 
		}); 

		this.emit(this.events.GUESSING_LOCATION); 

		return this.readyForGameplay(); 

	}, 

	loadFirstGame() {

		const stage = gameStages.PREGAME; 

		this.store.dispatch({
			stage, 
			type: actions.SET_GAME_STAGE 
		}); 

		this.setStageRequirements(stage); 

		this.emit(this.events.GAME_STAGE, { stage }); 

		this.addEventListeners(); 

		return this.readyForGameplay()

			.then(() => this.startGamePlay()); 		

	}, 

	loadGame() {

		let loadProcess = null; 

		const { hasStarted } = this.store.getState(); 

		if (hasStarted) {

			loadProcess = this.loadNewGame(); 

		} else {

			loadProcess = this.loadFirstGame(); 

		}

		return loadProcess; 

	}, 

	loadNewGame() {

		this.store.dispatch({
			type: actions.RESTART_GAME
		}); 

		return this.startGamePlay(); 

	}, 

	loadPanorama() {

		const previousStage = this.store.getState().gameStage; 

		const stage = gameStages.LOADING_PANORAMA; 

		const { featureCollection } = this.locationData;  

		this.store.dispatch({
			type: actions.NEXT_TURN, 
			turn: {
				boroughName: null, 
				randomLatLng: null, 
				selectedBorough: null
			}
		}); 

		this.setStageRequirements(stage); 
		
		this.store.dispatch({
			stage,  
			type: actions.SET_GAME_STAGE
		}); 

		this.emit(this.events.GAME_STAGE, {
			stage, 
			previousStage
		}); 

		return this.getRandomPanoramaLocation(featureCollection) 

			.then(locationData => {  // boroughName, randomLatLng

				this.store.dispatch({
					type: actions.SET_TURN_LOCATION_DATA, 
					turn: {
						...locationData, 
						selectedBorough: null
					}
				}); 

				return locationData; 

			})

			.then(() => this.readyForNextStage()); 

	}, 

	maximumRoundsPlayed() {

		const { totalRounds } = this.store.getState(); 

		return totalRounds === DEFAULT_MAXIMUM_ROUNDS; 

	}, 

	nextTurn() {

		this.emit(this.events.NEXT_TURN); 

		return this.loadPanorama()

			.then(() => this.showPanorama())

			.then(() => this.guessLocation())

			.then(() => this.evaluateAnswer()); 

	}, 

	onAnswerEvaluated() {

		createPromiseTimeout(ANSWER_EVALUATION_DELAY) 

			.then(() => this.emit(this.events.TURN_COMPLETE));

	}, 

	onCityLocationDataReceived(locationData) {

		window.console.log("locationData:", locationData); 

		this.locationData = locationData; 
		
		this.emit(this.events.HOST_LOCATION_DATA, locationData); 

	}, 

	onGameOver() {

		const previousStage = gameStages.EVALUATING_ANSWER; 

		const stage = gameStages.POSTGAME; 

		this.store.dispatch({
			stage, 
			type: actions.SET_GAME_STAGE
		}); 

		this.emit(this.events.GAME_STAGE, { stage, previousStage }); 
	
	}, 

	onGameStage() {


	}, 

	onGeoJSONLoaded(geoJSON) {

		if (!(this.worker)) {

			this.locationData.featureCollection = geoJSON; 

		}

	}, 

	onGuessingLocation() {

		this.store.dispatch({
			type: actions.CAN_EVALUATE_ANSWER
		}); 

	}, 

	onTurnComplete() {
		
		this.store.dispatch({
			type: actions.INCREMENT_TOTAL_ROUNDS
		}); 

		this.addTurnToGameHistory();

		this.store.dispatch({
			type: actions.CLEAR_CURRENT_TURN
		}); 

		if (this.maximumRoundsPlayed()) {

			this.endGame(); 

		} else {

			this.nextTurn(); 

		}

	}, 

	onViewComplete() {



	}, 

	readyForGameplay() {

		return this.readyForNextStage(); 

	}, 

	readyForNextStage() {

		const { stageRequirements } = this.store.getState(); 

		return Promise.all(stageRequirements); 

	}, 

	restart() {

		return this.start(); 

	}, 

	setStageRequirements(stage) {

		const requirements = []; 

		const viewComplete = new Promise(resolve => {

			this.on(this.events.VIEW_COMPLETE, completedStage => {

				if (completedStage === stage) {

					resolve(); 

				}

			}); 

		}); 

		requirements.push(viewComplete); 

		if (gameStages.PREGAME === stage) {

			const geoJSONLoaded = this.geoJSONLoaded();

			requirements.push(geoJSONLoaded);  
		
		}

		this.store.dispatch({
			type: actions.CLEAR_STAGE_REQUIREMENTS
		}); 		

		this.store.dispatch({
			requirements, 
			type: actions.ADD_STAGE_REQUIREMENTS
		}); 

	}, 

	showPanorama() {

		const stage = gameStages.SHOWING_PANORAMA; 

		this.setStageRequirements(stage); 

		this.store.dispatch({
			stage, 
			type: actions.SET_GAME_STAGE
		}); 

		this.emit(this.events.GAME_STAGE, {
			stage, 
			previousStage: gameStages.LOADING_PANORAMA
		}); 

		this.emit(this.events.RANDOM_LOCATION); 

		return this.readyForNextStage(); 

	}, 

	start() {

		return this.loadGame(); 

	}, 

	startGamePlay() {

		this.store.dispatch({
			type: actions.START_GAME
		}); 

		this.nextTurn(); 

	}, 

	totalCorrectAnswers() {

		const { gameHistory } = this.store.getState(); 

		return gameHistory.filter(turnHistory => turnHistory.selectedBorough === turnHistory.boroughName).length; 

	}

}); 

export default TwoBlocksGame; 
