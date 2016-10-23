/* global window */

import calculateDistanceFromMarkerToLocation from './calculateDistanceFromMarkerToLocation'; 
import createPromiseTimeout from './createPromiseTimeout';  
import getRandomPanoramaLocation from './getRandomPanoramaLocation';  
import request from 'superagent'; 
import { EventEmitter } from 'events'; 
import { inherits } from 'util';
import { events, nycCoordinates, ANSWER_EVALUATION_DELAY, DEFAULT_MAP_ZOOM, DEFAULT_MAXIMUM_ROUNDS, MAXIMUM_RANDOM_PANORAMA_ATTEMPTS } from './constants/constants';   
import actions from './actions/actions'; 

let geoJSONLoaded = false; 

const TwoBlocksGame = function TwoBlocksGame(store) {

	this.store = store;   
  
	this.locationData = null; 

}; 
	
/*----------  Inherit from EventEmitter  ----------*/

inherits(TwoBlocksGame, EventEmitter); 

/*----------  Define TwoBlocksGame Prototype  ----------*/

TwoBlocksGame.prototype = Object.assign(TwoBlocksGame.prototype, {

	addEventListeners() {

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
		
		return getRandomPanoramaLocation(featureCollection, attemptsLeft) 

			.catch(() => {

				if (attemptsLeft === 0) {

					throw new Error("Attempts to request a random Google Street View failed too many times.  Check your internet connection."); 

				}

				attemptsLeft = attemptsLeft - 1; 

				window.console.log(`Failure to request nearest panorama.  ${attemptsLeft} more attempts left.`); 

				return getRandomPanoramaLocation(featureCollection, attemptsLeft); 

			}) 						

			.then(randomLocationDetails => {
				
				const { randomLatLng } = randomLocationDetails; 

				window.console.log("randomLatLng:", randomLatLng); 

				return randomLocationDetails; 

			}); 

	}, 

	totalCorrectAnswers() {

		const { gameHistory } = this.store.getState(); 

		return gameHistory.filter(turnHistory => turnHistory.selectedBorough === turnHistory.boroughName).length; 

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

	onGeoJSONLoaded(locationData) {

		const { GEO_JSON_SOURCE } = nycCoordinates; 

		// Set 'geoJSONLoaded' flag to true so we don't produce 
		// the side effect of repeatedly loading the same GeoJSON 
		// over the map on every new game instance.   
		geoJSONLoaded = true; 

		return request.get(GEO_JSON_SOURCE)

			.then(response => {

				const geoJSON = response.body; 

				if (!(geoJSON)) {

					throw new Error("No GeoJSON returned from the request for location data."); 

				}

				locationData.featureCollection = geoJSON;
				
				this.locationData = locationData; 

				this.startGamePlay(); 

			}); 

	}, 

	onPregameLocationDataReceived(locationData) {

		window.console.log("locationData:", locationData); 

		this.emit(events.HOST_LOCATION_DATA, locationData); 

		this.locationData = locationData; 

	}, 

	startGame() {

		this.emit(events.GAME_STAGE, 'pregame'); 

		this.getLocationData(); 

		this.addEventListeners(); 

		this.store.dispatch({
			type: actions.START_GAME
		}); 

	}, 

	startGamePlay() {

		const stage = 'gameplay';
		
		this.store.dispatch({
			stage,
			type: actions.SET_GAME_STAGE 
		}); 

		this.emit(events.GAME_STAGE, stage); 

	}

}); 

export default TwoBlocksGame; 
