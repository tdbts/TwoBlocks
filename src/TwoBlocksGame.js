/* global window */
   
// import actions from './actions/actions'; 
import { EventEmitter } from 'events'; 
import { inherits } from 'util';
import { createPromiseTimeout } from './utils/utils'; 
import { events, gameStages, nycCoordinates, ANSWER_EVALUATION_DELAY, DEFAULT_MAXIMUM_ROUNDS, MAXIMUM_EVENT_EMITTER_LISTENERS, MAXIMUM_RANDOM_PANORAMA_ATTEMPTS } from './constants/constants';   
import TwoBlocksGameDispatcher from './game-components/TwoBlocksGameDispatcher'; 

const TwoBlocksGame = function TwoBlocksGame(store, worker, service) {

	this.events = events; 
	this.store = store;   
	this.worker = worker; 
	this.service = service; 
	this.locationData = {}; 

	this.gameDispatcher = new TwoBlocksGameDispatcher(this.store);

	this._geoJSONLoaded = new Promise(resolve => this.once(events.GEO_JSON_LOADED, resolve)); 

	this.subscribeToStateChanges(); 

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

EventEmitter.prototype._maxListeners = MAXIMUM_EVENT_EMITTER_LISTENERS; 

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

		this.gameDispatcher.saveTurn(currentTurn); 

	}, 

	answerIsCorrect(correctBorough, selectedBorough) {

		return correctBorough === selectedBorough; 

	}, 

	endGame() {

		this.nextGameStage(); 

		this.gameDispatcher.gameOver(); 

		this.emit(this.events.GAME_OVER); 

	}, 

	evaluateAnswer() {

		const { canEvaluateAnswer, currentTurn } = this.store.getState(); 

		const { selectedBorough, boroughName: correctBorough } = currentTurn; 

		if (!(canEvaluateAnswer)) return;

		this.nextGameStage(); 

		// Don't allow answer evaluation until the next turn
		this.gameDispatcher.cannotEvaluateAnswer();  

		if (this.answerIsCorrect(correctBorough, selectedBorough)) {

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

	getNextGameStage() {

		let nextStage = null; 

		const { gameStage } = this.store.getState(); 

		if (null === gameStage) {

			nextStage = gameStages.PREGAME; 
	
		} else if (gameStages.PREGAME === gameStage) {

			nextStage = gameStages.LOADING_PANORAMA; 

		} else if (gameStages.LOADING_PANORAMA === gameStage) {

			nextStage = gameStages.SHOWING_PANORAMA; 

		} else if (gameStages.SHOWING_PANORAMA === gameStage) {

			nextStage = gameStages.GUESSING_LOCATION; 

		} else if (gameStages.GUESSING_LOCATION === gameStage) {

			nextStage = gameStages.EVALUATING_ANSWER; 

		} else if ((gameStages.EVALUATING_ANSWER === gameStage) && !(this.gameOver())) {

			nextStage = gameStages.LOADING_PANORAMA; 

		} else if (gameStages.EVALUATING_ANSWER === gameStage && this.gameOver()) {

			nextStage = gameStages.POSTGAME; 

		} else if (gameStages.POSTGAME === gameStage) {

			// Handle restarts.  'PREGAME' stage only exists before first game. 
			nextStage = gameStage.LOADING_PANORAMA; 

		}

		return nextStage; 

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

		this.nextGameStage(); 

		this.emit(this.events.GUESSING_LOCATION); 

		return this.readyForGameplay(); 

	}, 

	loadFirstGame() {

		this.addEventListeners(); 

		return this.readyForGameplay()

			.then(() => this.startGamePlay()); 		

	}, 

	loadGame() {

		this.nextGameStage(); 

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

		this.gameDispatcher.restartGame(); 

		return this.startGamePlay(); 

	}, 

	loadPanorama() {

		this.nextGameStage(); 

		const { featureCollection } = this.locationData;  

		const turn = {
			boroughName: null, 
			randomLatLng: null, 
			selectedBorough: null
		}; 

		this.gameDispatcher.nextTurn(turn);  

		return this.getRandomPanoramaLocation(featureCollection) 

			.then(locationData => this.onRandomPanoramaLocation(locationData))

			.then(() => this.readyForNextStage()); 

	}, 

	maximumRoundsPlayed() {

		const { totalRounds } = this.store.getState(); 

		return totalRounds === DEFAULT_MAXIMUM_ROUNDS; 

	}, 

	nextGameStage() {

		const { gameStage: previousStage } = this.store.getState(); 

		const stage = this.getNextGameStage(); 

		this.setStageRequirements(stage); 

		this.gameDispatcher.setGameStage(stage); 

		this.emit(this.events.GAME_STAGE, { stage, previousStage }); 

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

			.then(() => this.addTurnToGameHistory())

			.then(() => this.emit(this.events.TURN_COMPLETE));

	}, 

	onCityLocationDataReceived(locationData) {

		window.console.log("locationData:", locationData); 

		this.locationData = locationData; 
		
		this.emit(this.events.HOST_LOCATION_DATA, locationData); 

	}, 

	onDispatchedAction() {

		

	}, 

	onGameOver() {

		this.nextGameStage(); 
	
	}, 

	onGameStage() {


	}, 

	onGeoJSONLoaded(geoJSON) {

		if (!(this.worker)) {

			this.locationData.featureCollection = geoJSON; 

		}

	}, 

	onGuessingLocation() {

		this.gameDispatcher.canEvaluateAnswer(); 

	}, 

	onRandomPanoramaLocation(locationData) {
		
		const turn = {
			...locationData, 
			selectedBorough: null
		}; 

		this.gameDispatcher.setTurnLocationData(turn); 

		return locationData; 
	
	}, 

	onTurnComplete() {
		
		this.gameDispatcher.incrementTotalRounds(); 
		this.gameDispatcher.clearCurrentTurn(); 

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

		this.gameDispatcher.clearStageRequirements(); 

		this.gameDispatcher.addStageRequirements(requirements); 

	}, 

	showPanorama() {

		this.nextGameStage(); 

		this.emit(this.events.RANDOM_LOCATION); 

		return this.readyForNextStage(); 

	}, 

	start() {

		return this.loadGame(); 

	}, 

	startGamePlay() {

		this.gameDispatcher.startGame(); 

		this.nextTurn(); 

	}, 

	subscribeToStateChanges() {

		this.store.subscribe(() => this.onDispatchedAction()); 

	}, 

	totalCorrectAnswers() {

		const { gameHistory } = this.store.getState(); 

		return gameHistory.filter(turnHistory => turnHistory.selectedBorough === turnHistory.boroughName).length; 

	}

}); 

export default TwoBlocksGame; 
