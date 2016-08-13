import calculateDistanceFromMarkerToLocation from './calculateDistanceFromMarkerToLocation'; 
import createGameComponents from './createGameComponents'; 
import getRandomPanoramaLocation from './getRandomPanoramaLocation'; 
import { EventEmitter } from 'events'; 
import { inherits } from 'util';
import { events, nycCoordinates, DEFAULT_TOTAL_ROUNDS, MAXIMUM_RANDOM_PANORAMA_ATTEMPTS, NYC_BOUNDARIES_DATASET_URL } from './constants/constants';  

const TwoBlocksGame = function TwoBlocksGame(mapCanvas, panoramaCanvas) {

	this.validateArgs(mapCanvas, panoramaCanvas); 

	this.mapCanvas = mapCanvas; 
	this.panoramaCanvas = panoramaCanvas; 
	this.totalRounds = 0; 

	this.chooseLocationMap = null; 
	this.chooseLocationMarker = null; 
	this.locationData = null; 
	this.gameStage = null; 
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

		this.on(events.GAME_STAGE, gameStage => {

			if ('gameplay' === gameStage) {

				this.emit(events.NEXT_TURN); 

			}

		}); 

		this.on(events.NEXT_TURN, () => this.nextTurn()); 

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

	}, 

	createGameComponents() {

		const gameComponents = createGameComponents({
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

	gameOver() {

		return this.totalRounds === DEFAULT_TOTAL_ROUNDS;  // Placeholder
	
	},

	getLocationData() {

		return Promise.resolve(nycCoordinates)

			.then(locationData => this.onPregameLocationDataReceived(locationData)); 

	},

	loadCityGeoJSON() {

		return new Promise(resolve => {

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

				resolve();  

			}); 

		}); 		

	}, 

	nextTurn() {

		return this.setRandomLocation() 

			.then(locationData => this.emit(events.RANDOM_LOCATION, locationData))

			.then(this.totalRounds += 1); 

	}, 

	onPregameLocationDataReceived(locationData) {

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
