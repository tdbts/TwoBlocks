/* global window */

import calculateDistanceFromMarkerToLocation from './calculateDistanceFromMarkerToLocation'; 
import createPromiseTimeout from './createPromiseTimeout';  
import getRandomPanoramaLocation from './getRandomPanoramaLocation';   
import request from 'superagent'; 
import actions from './actions/actions'; 
import { EventEmitter } from 'events'; 
import { inherits } from 'util';
import { events, nycCoordinates, workerMessages, ANSWER_EVALUATION_DELAY, DEFAULT_MAP_ZOOM, DEFAULT_MAXIMUM_ROUNDS, MAXIMUM_RANDOM_PANORAMA_ATTEMPTS } from './constants/constants';   

const TwoBlocksGame = function TwoBlocksGame(store, worker) {

	this.store = store;   
  
	this.locationData = {}; 
	this.worker = worker

	this._geoJSONLoaded = new Promise(resolve => this.once(events.GEO_JSON_LOADED, resolve)); 

}; 
	
/*----------  Inherit from EventEmitter  ----------*/

inherits(TwoBlocksGame, EventEmitter); 

/*----------  Define TwoBlocksGame Prototype  ----------*/

TwoBlocksGame.prototype = Object.assign(TwoBlocksGame.prototype, {

	addEventListeners() {

		this.on(events.GAME_COMPONENTS, () => this.onGameComponents()); 

		this.on(events.GEO_JSON_LOADED, geoJSON => this.onGeoJSONLoaded(geoJSON)); 

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

		this.on(events.RESTART_GAME, () => this.restart()); 

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

	getGeoJSONSourceURL() {

		return Promise.resolve(nycCoordinates)

			.then(locationData => this.onCityLocationDataReceived(locationData)); 

	},

	geoJSONLoaded() {

		return this._geoJSONLoaded; 

	}, 

	getRandomPanoramaLocation(attemptsLeft = MAXIMUM_RANDOM_PANORAMA_ATTEMPTS, featureCollection) {
		
		return getRandomPanoramaLocation(this.worker, featureCollection) 

			.catch(() => {

				if (attemptsLeft === 0) {

					throw new Error("Attempts to request a random Google Street View failed too many times.  Check your internet connection."); 

				}

				attemptsLeft = attemptsLeft - 1; 

				window.console.log(`Failure to request nearest panorama.  ${attemptsLeft} more attempts left.`); 

				return getRandomPanoramaLocation(this.worker, featureCollection); 

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

		const { featureCollection } = this.locationData;  

		this.store.dispatch({
			type: actions.CAN_EVALUATE_ANSWER
		}); 

		return this.getRandomPanoramaLocation(this.worker, featureCollection) 

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

	onCityLocationDataReceived(locationData) {

		window.console.log("locationData:", locationData); 

		this.locationData = locationData; 
		
		this.emit(events.HOST_LOCATION_DATA, locationData); 

	}, 

	onGameComponents() {



	}, 

	onGeoJSONLoaded(geoJSON) {

		if (!(this.worker)) {

			this.locationData.featureCollection = geoJSON; 

		}

	}, 

	readyForGameplay() {

		const viewReady = new Promise(resolve => {

			this.on(events.VIEW_READY, resolve); 

		}); 

		const prerequisites = [

			this.geoJSONLoaded(),  
			viewReady
		
		]; 

		return Promise.all(prerequisites); 

	}, 

	restart() {

		this.store.dispatch({
			type: actions.RESTART_GAME
		}); 

		this.startGamePlay(); 

	}, 

	start() {

		this.emit(events.GAME_STAGE, 'pregame'); 

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
