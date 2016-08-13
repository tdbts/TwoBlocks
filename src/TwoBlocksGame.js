import calculateDistanceFromMarkerToLocation from './calculateDistanceFromMarkerToLocation'; 
import createGameComponents from './createGameComponents'; 
import getRandomPanoramaLocation from './getRandomPanoramaLocation'; 
import { EventEmitter } from 'events'; 
import { inherits } from 'util';
import { nycCoordinates, NYC_BOUNDARIES_DATASET_URL } from './constants/constants';  

const TwoBlocksGame = function TwoBlocksGame(mapCanvas, panoramaCanvas) {

	this.validateArgs(mapCanvas, panoramaCanvas); 

	this.gameStage = null; 
	this.mapCanvas = mapCanvas; 
	this.panoramaCanvas = panoramaCanvas; 

	this.chooseLocationMap = null; 
	this.chooseLocationMarker = null; 
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

		this.on('game_components', gameComponents => {
		
			this.addEventListenersToGameComponents(gameComponents);

			this.loadCityGeoJSON()
				
				.then(() => {
					
					this.gameStage = 'gameplay'; 

					this.emit('gamestage', this.gameStage); 

				}); 
		
		}); 

		this.on('gamestage', gameStage => {

			if ('gameplay' === gameStage) {

				this.emit('next_turn'); 

			}

		}); 

		this.on('next_turn', () => this.nextTurn()); 

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

		this.emit('game_components', gameComponents); 

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

				this.emit('location_data', Object.assign({}, this.locationData)); 

				resolve();  

			}); 

		}); 		

	}, 

	nextTurn() {

		return this.setRandomLocation() 

			.then(locationData => this.emit('random_location', locationData)); 

	}, 

	onPregameLocationDataReceived(locationData) {

		this.emit('location_data', locationData); 

		const { lat, lng } = locationData.CENTER; 

		const mapLatLng = new google.maps.LatLng(lat, lng); 

		this.emit('view', {
			mapLatLng, 
			view: 'map' 
		}); 

		this.locationData = locationData; 
		this.mapLatLng = mapLatLng;

		this.createGameComponents();  

	}, 

	setRandomLocation() {

		const { featureCollection } = this.locationData;  
		
		return getRandomPanoramaLocation(featureCollection) 

			.then(randomLocationDetails => {
				
				const { randomLatLng } = randomLocationDetails; 

				window.console.log("randomLatLng.lat():", randomLatLng.lat()); 
				window.console.log("randomLatLng.lng():", randomLatLng.lng()); 

				return randomLocationDetails; 

			})

			.catch((...args) => `Caught error with args ${args}`); 						

	}, 

	startGame() {

		this.emit('gamestage', 'pregame'); 

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
