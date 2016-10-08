/* global window */

import calculateDistanceFromMarkerToLocation from './calculateDistanceFromMarkerToLocation'; 
import createGameComponents from './createGameComponents';
import createPromiseTimeout from './createPromiseTimeout';  
import getRandomPanoramaLocation from './getRandomPanoramaLocation'; 
import removeStreetNameAnnotations from './removeStreetNameAnnotations'; 
import { EventEmitter } from 'events'; 
import { inherits } from 'util';
import { events, nycCoordinates, ANSWER_EVALUATION_DELAY, DEFAULT_MAP_ZOOM, DEFAULT_TOTAL_ROUNDS, MAXIMUM_RANDOM_PANORAMA_ATTEMPTS, MINIMUM_SPINNER_SCREEN_WIDTH, NYC_BOUNDARIES_DATASET_URL } from './constants/constants';  

let geoJSONLoaded = false; 

const TwoBlocksGame = function TwoBlocksGame(mapCanvas, panoramaCanvas) {

	this.validateArgs(mapCanvas, panoramaCanvas); 

	this.canEvaluateAnswer = true; 
	this.gameIsOver = false; 
	this.mapCanvas = mapCanvas; 
	this.panoramaCanvas = panoramaCanvas; 
	this.totalRounds = 0; 

	this.chooseLocationMap = null; 
	this.chooseLocationMarker = null; 
	this.currentTurn = null; 
	this.gameStage = null; 
	this.gameHistory = null; 
	this.locationData = null; 
	this.mapLatLng = null; 
	this.panorama = null; 
	this.spinner = null; 

}; 
	
/*----------  Inherit from EventEmitter  ----------*/

inherits(TwoBlocksGame, EventEmitter); 

/*----------  Define TwoBlocksGame Prototype  ----------*/

TwoBlocksGame.prototype = Object.assign(TwoBlocksGame.prototype, {

	addEventListeners() {

		this.on(events.GAME_COMPONENTS, gameComponents => {
		
			this.addEventListenersToGameComponents(gameComponents);

			this.loadCityGeoJSON()
				
				.then(() => {
					
					this.gameStage = 'gameplay'; 

					this.emit(events.GAME_STAGE, this.gameStage); 

				}); 
		
		}); 

		this.on(events.GEO_JSON_LOADED, () => {

			// Set 'geoJSONLoaded' flag to true so we don't produce 
			// the side effect of repeatedly loading the same GeoJSON 
			// over the map on every new game instance.   
			geoJSONLoaded = true; 

		}); 

		this.on(events.GAME_STAGE, gameStage => {

			if ('gameplay' === gameStage) {

				this.emit(events.NEXT_TURN); 

			}

		}); 

		this.on(events.NEXT_TURN, () => this.nextTurn()); 

		this.on(events.ANSWER_EVALUATED, answerDetails => {

			window.console.log("answerDetails:", answerDetails); 
 
			this.currentTurn.selectedBorough = answerDetails.selectedBorough;  	

			createPromiseTimeout(ANSWER_EVALUATION_DELAY) 

				.then(() => this.emit(events.TURN_COMPLETE));

		}); 

		this.on(events.TURN_COMPLETE, () => {
		
			this.totalRounds += 1;

			this.addTurnToGameHistory();
		
			this.currentTurn = null; 

			if (this.maximumRoundsPlayed()) {

				this.emit(events.GAME_OVER); 

			} else {

				this.emit(events.NEXT_TURN); 

			}

		}); 

		this.on(events.GAME_OVER, () => {
		
			this.gameIsOver = true; 

			this.gameStage = 'postgame'; 	

			this.emit(events.GAME_STAGE, this.gameStage); 
		
		}); 

	},

	addEventListenersToGameComponents(gameComponents) {

		/*----------  Add event listeners to Choose Location Map / Marker  ----------*/

		const { chooseLocationMap, chooseLocationMarker, panorama } = gameComponents; 
		
		const eventToEntityMap = {
			'dragend': chooseLocationMarker, 
			'click': chooseLocationMap
		}; 

		const logDistanceFromPanorama = () => {

			const distanceFromPanoramaInMiles = calculateDistanceFromMarkerToLocation(panorama, chooseLocationMarker); 

			window.console.log("distanceFromPanoramaInMiles:", distanceFromPanoramaInMiles); 

		}; 

		for (const event in eventToEntityMap) {

			google.maps.event.addListener(eventToEntityMap[event], event, logDistanceFromPanorama); 

		} 	

		/*----------  Add listeners to panorama  ----------*/
		
		google.maps.event.addListener(panorama, 'pano_changed', () => removeStreetNameAnnotations(panorama)); 

	}, 

	addTurnToGameHistory() {

		if (!(this.gameHistory)) {

			this.gameHistory = []; 

		}

		this.gameHistory = this.gameHistory.concat(this.currentTurn);  

	}, 

	createGameComponents() {

		const gameComponents = createGameComponents({
			gameInstance: this, 
			locationData: this.locationData, 
			mapCanvas: this.mapCanvas, 
			mapLatLng: this.mapLatLng, 
			mapMarkerVisible: false, 
			panoramaCanvas: this.panoramaCanvas	
		}); 

		for (const component in gameComponents) {

			this[component] = gameComponents[component]; 

		}

		this.emit(events.GAME_COMPONENTS, gameComponents); 

	}, 

	evaluateFinalAnswer(correctBorough, selectedBorough) {

		if (!(this.canEvaluateAnswer)) return; 

		window.console.log("Evaluating final answer!"); 

		this.canEvaluateAnswer = false;  // Don't allow answer evaluation until the next turn 

		if (selectedBorough === correctBorough) {

			this.emit(events.CORRECT_BOROUGH, correctBorough);  
		
		} else {

			this.emit(events.INCORRECT_BOROUGH, { correctBorough, selectedBorough });  

		}

		const { randomLatLng } = this.currentTurn; 

		this.emit(events.ANSWER_EVALUATED, { correctBorough, randomLatLng, selectedBorough }); 

	}, 

	gameOver() {

		return this.gameIsOver; 
	
	},

	getLocationData() {

		return Promise.resolve(nycCoordinates)

			.then(locationData => this.onPregameLocationDataReceived(locationData)); 

	},

	totalCorrectAnswers() {

		return this.gameHistory.filter(turnHistory => turnHistory.selectedBorough === turnHistory.boroughName).length; 

	}, 

	loadCityGeoJSON() {

		return new Promise(resolve => {

			if (geoJSONLoaded) {

				resolve(); 

				return; 

			} 

			const { chooseLocationMap } = this; 

			if (!(chooseLocationMap)) {

				throw new Error("The 'chooseLocationMap' has not been loaded.  Cannot load city's GeoJSON data."); 

			}

			/*----------  Load GeoJSON  ----------*/
			
			// Each borough is a feature 
			chooseLocationMap.data.loadGeoJson(NYC_BOUNDARIES_DATASET_URL, {}, featureCollection => {

				window.console.log("featureCollection:", featureCollection); 

				this.locationData = Object.assign(this.locationData, { featureCollection }); 

				this.emit(events.HOST_LOCATION_DATA, Object.assign({}, this.locationData)); 

				this.emit(events.GEO_JSON_LOADED); 

				resolve();  

			}); 

		}); 		

	}, 

	maximumRoundsPlayed() {

		return this.totalRounds === DEFAULT_TOTAL_ROUNDS; 

	}, 

	nextTurn() {

		this.canEvaluateAnswer = true; 

		if (this.chooseLocationMarker) {

			this.chooseLocationMarker.setMap(null); 

		}

		return this.setRandomLocation() 

			.then(locationData => {  // boroughName, randomLatLng

				this.currentTurn = {
					...locationData, 
					selectedBorough: null 
				}; 

				return locationData; 

			})

			.then(locationData => this.emit(events.RANDOM_LOCATION, locationData)); 

	}, 

	onPregameLocationDataReceived(locationData) {

		// window.console.log("locationData:", locationData); 

		this.emit(events.HOST_LOCATION_DATA, locationData); 

		const { lat, lng } = locationData.CENTER; 

		const mapLatLng = new google.maps.LatLng(lat, lng); 

		this.emit(events.VIEW_CHANGE, {
			mapLatLng, 
			view: 'map' 
		}); 

		this.locationData = locationData; 
		this.mapLatLng = mapLatLng;

		this.createGameComponents();  

	}, 

	setRandomLocation(attemptsLeft = MAXIMUM_RANDOM_PANORAMA_ATTEMPTS) {

		if (attemptsLeft === 0) {

			throw new Error("Attempts to request a random Google Street View failed too many times.  Check your internet connection."); 

		}

		attemptsLeft = attemptsLeft - 1; 

		const { featureCollection } = this.locationData;  
		
		return getRandomPanoramaLocation(featureCollection) 

			.catch(() => {

				window.console.log(`Failure to request nearest panorama.  ${attemptsLeft} more attempts left.`); 

				return this.setRandomLocation(attemptsLeft); 

			}) 						

			.then(randomLocationDetails => {
				
				const { randomLatLng } = randomLocationDetails; 

				window.console.log("randomLatLng.lat():", randomLatLng.lat()); 
				window.console.log("randomLatLng.lng():", randomLatLng.lng()); 

				return randomLocationDetails; 

			}); 

	}, 

	shouldShowSpinner() {

		const conditions = [

			window.screen.width >= MINIMUM_SPINNER_SCREEN_WIDTH

		]; 

		return conditions.every(condition => condition === true); 

	}, 

	shouldUseDeviceOrientation() {

		const conditions = [

			!!(window.DeviceOrientationEvent) || !!(window.DeviceMotionEvent), 
			window.screen.width < MINIMUM_SPINNER_SCREEN_WIDTH

		]; 

		return conditions.every(condition => !!condition); 

	}, 

	startGame() {

		this.emit(events.GAME_STAGE, 'pregame'); 

		this.getLocationData(); 

		this.addEventListeners(); 

	}, 

	validateArgs(mapCanvas, panoramaCanvas) {

		if (!(mapCanvas) || !(panoramaCanvas)) {

			throw new Error("Invalid arguments passed to TwoBlocksGame() constructor."); 

		}

	}

}); 

export default TwoBlocksGame; 
