/* global window */

import calculateDistanceFromMarkerToLocation from './calculateDistanceFromMarkerToLocation'; 
import createPromiseTimeout from './createPromiseTimeout';  
import getRandomPanoramaLocation from './getRandomPanoramaLocation';   
import TwoBlocksWorker from './workers/twoBlocks.worker.js'; 
import request from 'superagent'; 
import { EventEmitter } from 'events'; 
import { inherits } from 'util';
import { events, nycCoordinates, workerMessages, ANSWER_EVALUATION_DELAY, DEFAULT_MAP_ZOOM, DEFAULT_MAXIMUM_ROUNDS, MAXIMUM_RANDOM_PANORAMA_ATTEMPTS } from './constants/constants';   
import actions from './actions/actions'; 

let geoJSONLoaded = false; 

const TwoBlocksGame = function TwoBlocksGame(store) {

	this.store = store;   
  
	this.locationData = null; 
	this.worker = window.Worker ? new TwoBlocksWorker() : null; 

}; 
	
/*----------  Inherit from EventEmitter  ----------*/

inherits(TwoBlocksGame, EventEmitter); 

/*----------  Define TwoBlocksGame Prototype  ----------*/

TwoBlocksGame.prototype = Object.assign(TwoBlocksGame.prototype, {

	addEventListeners() {

		this.on(events.GAME_COMPONENTS, () => this.onGameComponents()); 

		this.on(events.GEO_JSON_LOADED, locationData => this.onGeoJSONLoaded(locationData)); 

		this.on(events.GAME_STAGE, gameStage => {

			if ('gameplay' === gameStage) {

				this.emit(events.NEXT_TURN); 

			}

		}); 

		this.on(events.NEXT_TURN, () => this.nextTurn()); 

		this.on(events.ANSWER_EVALUATED, answerDetails => {

			window.console.log("answerDetails:", answerDetails); 
 
			const { selectedBorough } = answerDetails; 

			this.store.dispatch({
				selectedBorough, 
				type: actions.BOROUGH_SELECTED
			}); 

			createPromiseTimeout(ANSWER_EVALUATION_DELAY) 

				.then(() => this.emit(events.TURN_COMPLETE));

		}); 

		this.on(events.TURN_COMPLETE, () => {
		
			this.store.dispatch({
				type: actions.INCREMENT_TOTAL_ROUNDS
			})

			this.addTurnToGameHistory();
		 
			this.store.dispatch({
				type: actions.CLEAR_CURRENT_TURN
			}); 

			if (this.maximumRoundsPlayed()) {

				this.store.dispatch({
					type: actions.GAME_OVER
				}); 

				this.emit(events.GAME_OVER); 

			} else {

				this.emit(events.NEXT_TURN); 

			}

		}); 

		this.on(events.GAME_OVER, () => {
		
			const stage = 'postgame'; 

			this.store.dispatch({
				stage, 
				type: actions.SET_GAME_STAGE
			})	

			this.emit(events.GAME_STAGE, stage); 
		
		}); 

	},

	addTurnToGameHistory() {

		const { currentTurn } = this.store.getState(); 

		this.store.dispatch({
			turn: currentTurn, 
			type: actions.SAVE_TURN
		}); 

	}, 

	evaluateFinalAnswer(correctBorough, selectedBorough) {

		const { canEvaluateAnswer } = this.store.getState(); 

		if (!(canEvaluateAnswer)) return; 

		window.console.log("Evaluating final answer!"); 

		this.store.dispatch({
			type: actions.CANNOT_EVALUATE_ANSWER  // Don't allow answer evaluation until the next turn
		}); 

		if (selectedBorough === correctBorough) {

			this.emit(events.CORRECT_BOROUGH, correctBorough);  
		
		} else {

			this.emit(events.INCORRECT_BOROUGH, { correctBorough, selectedBorough });  

		}

		const { randomLatLng } = this.store.getState().currentTurn;  

		this.emit(events.ANSWER_EVALUATED, { correctBorough, randomLatLng, selectedBorough }); 

	}, 

	gameOver() {

		return this.store.getState().gameOver; 
	
	},

	geoJSONLoaded() {

		return geoJSONLoaded; 

	}, 

	getLocationData() {

		return Promise.resolve(nycCoordinates)

			.then(locationData => this.onPregameLocationDataReceived(locationData)); 

	},

	getRandomPanoramaLocation(featureCollection, attemptsLeft = MAXIMUM_RANDOM_PANORAMA_ATTEMPTS) {
		
		return getRandomPanoramaLocation(featureCollection) 

			.catch(() => {

				if (attemptsLeft === 0) {

					throw new Error("Attempts to request a random Google Street View failed too many times.  Check your internet connection."); 

				}

				attemptsLeft = attemptsLeft - 1; 

				window.console.log(`Failure to request nearest panorama.  ${attemptsLeft} more attempts left.`); 

				return getRandomPanoramaLocation(featureCollection); 

			}) 						

			.then(randomLocationDetails => {
				
				const { randomLatLng } = randomLocationDetails; 

				window.console.log("randomLatLng:", randomLatLng); 

				return randomLocationDetails; 

			}); 

	}, 

	maximumRoundsPlayed() {

		const { totalRounds } = this.store.getState(); 

		return totalRounds === DEFAULT_MAXIMUM_ROUNDS; 

	}, 

	nextTurn() {

		/*==========================================
		=            Web Worker Testing            =
		==========================================*/
		
		window.console.log("this.worker:", this.worker); 		

		this.worker.onmessage = e => window.console.log("Heard dis:", e.data); 

		this.worker.addEventListener('error', e => window.console.log("Fucking error:", e)); 

		// this.worker.postMessage({
		// 	message: workerMessages.LOAD_GEO_JSON, 
		// 	payload: null
		// }); 

		this.worker.postMessage({
			message: workerMessages.REQUEST_GEO_JSON, 
			payload: "poop"
		}); 

		this.worker.postMessage({
			message: workerMessages.GET_RANDOM_LOCATION, 
			payload: null
		}); 
		
		/*=====  End of Web Worker Testing  ======*/
		

		const { featureCollection } = this.locationData;  

		this.store.dispatch({
			type: actions.CAN_EVALUATE_ANSWER
		}); 

		return this.getRandomPanoramaLocation(featureCollection) 

			.then(locationData => {  // boroughName, randomLatLng

				this.store.dispatch({
					type: actions.NEW_CURRENT_TURN, 
					turn: {
						...locationData, 
						selectedBorough: null
					}
				}); 

				return locationData; 

			})

			.then(locationData => this.emit(events.RANDOM_LOCATION, locationData)); 

	}, 

	onGameComponents() {

		return this.requestGeoJSON(); 

	}, 

	onGeoJSONLoaded(locationData) {

		// Set 'geoJSONLoaded' flag to true so we don't produce 
		// the side effect of repeatedly loading the same GeoJSON 
		// over the map on every new game instance.   
		geoJSONLoaded = true; 

	}, 

	onPregameLocationDataReceived(locationData) {

		window.console.log("locationData:", locationData); 

		this.emit(events.HOST_LOCATION_DATA, locationData); 

		this.locationData = locationData; 

	}, 

	readyForGameplay() {

		const geoJSONLoaded = new Promise(resolve => {

			this.on(events.GEO_JSON_LOADED, resolve); 

		}); 

		const prerequisites = [

			geoJSONLoaded
		
		]; 

		return Promise.all(prerequisites); 

	}, 

	requestGeoJSON() {

		const { GEO_JSON_SOURCE } = nycCoordinates; 

		const onGeoJSONReceived = geoJSON => {

			if (!(geoJSON)) {

				throw new Error("No GeoJSON returned from the request for location data."); 

			}

			this.locationData = {

				featureCollection: geoJSON

			}; 

			this.emit(events.GEO_JSON_LOADED, geoJSON); 

		}; 

		/*----------  If TwoBlocks WebWorker, use it to load the GeoJSON  ----------*/
		
		if (this.worker) {

			const geoJSONTransmissionListener = e => {

				window.console.log("e:", e); 

				const eventData = e.data; 

				const { message, payload } = eventData; 

				if (workerMessages.GEO_JSON_LOADED === message) {

					this.worker.postMessage({
						message: workerMessages.REQUEST_GEO_JSON, 
						payload: null
					}); 

				} else if (workerMessages.SENDING_GEO_JSON === message) {

					onGeoJSONReceived(payload); 

					this.worker.removeEventListener('message', geoJSONTransmissionListener); 

				}

			}; 

			// Add listener before posting message to worker 
			this.worker.addEventListener('message', geoJSONTransmissionListener); 

			/*----------  Instruct worker to load GeoJSON  ----------*/
			
			return this.worker.postMessage({

				message: workerMessages.LOAD_GEO_JSON, 
				payload: GEO_JSON_SOURCE

			}); 

		} else {

			return request.get(GEO_JSON_SOURCE)

				.then(response => onGeoJSONReceived(response.body)); 

		}

	}, 

	startGame() {

		this.emit(events.GAME_STAGE, 'pregame'); 

		this.getLocationData(); 

		this.addEventListeners(); 

		this.store.dispatch({
			type: actions.START_GAME
		}); 

		this.readyForGameplay()

			.then(() => this.startGamePlay()); 

	}, 

	startGamePlay() {

		const stage = 'gameplay';
		
		this.store.dispatch({
			stage,
			type: actions.SET_GAME_STAGE 
		}); 

		this.emit(events.GAME_STAGE, stage); 

	}, 

	totalCorrectAnswers() {

		const { gameHistory } = this.store.getState(); 

		return gameHistory.filter(turnHistory => turnHistory.selectedBorough === turnHistory.boroughName).length; 

	} 	

}); 

export default TwoBlocksGame; 
