/* global document, google, window */

import React from 'react';
import TwoBlocksGame from '../TwoBlocksGame'; 
import TwoBlocksView from './TwoBlocksView';
import TwoBlocksPrompt from './TwoBlocksPrompt';
import TwoBlocksSubmitter from './TwoBlocksSubmitter'; 
import calculateDistanceFromMarkerToLocation from '../calculateDistanceFromMarkerToLocation'; 
import createGameComponents from '../createGameComponents';
import getRandomPanoramaLocation from '../getRandomPanoramaLocation';  
import stylizeBoroughName from '../stylizeBoroughName';
import createPromiseTimeout from '../createPromiseTimeout';  
import { DEFAULT_TOTAL_ROUNDS, GAME_LOAD_DELAY, NYC_BOUNDARIES_DATASET_URL, nycCoordinates } from '../constants/constants'; 

class TwoBlocks extends React.Component {

	constructor(props) {

		super(props); 

		// Define initial state 
		this.state = {
			canvasesLoaded: false, 
			chooseLocationMap: null, 
			chooseLocationMarker: null, 
			gameHistory: [], 
			gameInstance: null, 
			gameStage: null, 
			hoveredBorough: null, 
			locationData: nycCoordinates, 
			mapCanvas: null, 
			mapLatLng: null,
			mapMarkerVisible: false,  
			panorama: null, 
			panoramaBorough: null, 
			panoramaCanvas: null, 
			panoramaLatLng: null, 
			promptText: 'loading...',
			selectedBorough: null, 
			spinner: null, 
			totalRounds: 0,  
			view: 'map' 
		}; 

		/*----------  Save reference to original setState() method  ----------*/
		
		this._superSetState = this.setState.bind(this); 

		/*----------  Override setState() to be promisified  ----------*/
		
		this.setState = nextState => {

			return new Promise(resolve => {

				this._superSetState(nextState, resolve); 

			}); 

		}; 

	}

	componentDidUpdate(prevProps, prevState) {  // eslint-disable-line no-unused-vars

		// Child <TwoBlocksMap /> and <TwoBlocksPanorama /> 
		// components will call methods which update this 
		// component's state with the child components' 
		// respective DOM elements.  Once both elements 
		// exist in state, initialize TwoBlocks.  
		this.initializeTwoBlocks(); 

		this.handleGameStageTransition(prevProps, prevState); 

	}

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

	}

	addGameEventListeners(twoBlocks) {

		twoBlocks.on('gamestage', gameStage => this.setState({ gameStage })); 

	}

	addTurnToGameHistory() {

		const turnHistory = {
			panoramaBorough: this.state.panoramaBorough, 
			panoramaLatLng: this.state.panoramaLatLng, 
			selectedBorough: this.state.selectedBorough
		}; 

		return this.setState({

			gameHistory: this.state.gameHistory.concat(turnHistory)

		}); 

	}

	beforeNextTurn() {

		const { chooseLocationMap } = this.state; 

		chooseLocationMap.data.revertStyle(); 

		return this.setState({
			selectedBorough: null
		}); 

	}

	evaluateFinalAnswer() {

		window.console.log("Evaluating final answer!"); 

		if (this.state.selectedBorough === this.state.panoramaBorough) {

			this.onCorrectBorough(this.state.panoramaBorough); 
		
		} else {

			this.onIncorrectBorough(this.state.selectedBorough, this.state.panoramaBorough); 

		}

		createPromiseTimeout(3000)

			.then(() => this.onTurnComplete()); 

	}

	gameIsOver() {

		return this.state.totalRounds === DEFAULT_TOTAL_ROUNDS;  // Placeholder
	
	}

	getTotalCorrectAnswers() {

		return this.state.gameHistory.filter(turnHistory => turnHistory.selectedBorough === turnHistory.panoramaBorough).length; 

	}

	handleGameStageTransition(prevProps, prevState) {  // eslint-disable-line no-unused-vars

		// If the game stage has not changed, exit 
		if (prevState.gameStage === this.state.gameStage) return; 

		if ('pregame' === this.state.gameStage) {

			this.onTransitionToPregame(); 

		} else if ('gameplay' === this.state.gameStage) {

			this.onTransitionToGameplay();

		}

	}

	initializeTwoBlocks() {

		if (this.state.canvasesLoaded) return; 

		if (!(this.state.mapCanvas) || !(this.state.panoramaCanvas)) return; 

		const { mapCanvas, panoramaCanvas } = this.state; 

		[ mapCanvas, panoramaCanvas ].forEach(canvas => {

			if (!(canvas)) {

				throw new Error(`No element with ID '#${this.props[ mapCanvas === canvas ? "mapCanvasId" : "panoramaCanvasId" ]}' could be found on the page.`); 

			}

		}); 

		const twoBlocks = new TwoBlocksGame(mapCanvas, panoramaCanvas); 

		this.addGameEventListeners(twoBlocks); 

		twoBlocks.startGame(); 

		const nextState = {
			canvasesLoaded: true, 
			gameInstance: twoBlocks
		}; 

		this.setState(nextState)

			.then(() => {
				
				// gameComponents: chooseLocationMap, panorama, spinner 
				const gameComponents = createGameComponents(this.state);

				window.console.log("gameComponents:", gameComponents);		 

				this.addEventListenersToGameComponents(gameComponents);  
				
				return this.setState(gameComponents); 

			})

			.then(() => this.loadCityGeoJSON())

			.then(() => this.startGame()); 

	}

	loadCityGeoJSON() {

		return new Promise(resolve => {

			const { chooseLocationMap } = this.state; 

			if (!(chooseLocationMap)) {

				throw new Error("No 'chooseLocationMap' found in state.  Cannot load city's GeoJSON data."); 

			}

			/*----------  Load GeoJSON  ----------*/
			
			// Each borough is a feature 
			chooseLocationMap.data.loadGeoJson(NYC_BOUNDARIES_DATASET_URL, {}, featureCollection => {

				window.console.log("featureCollection:", featureCollection); 

				this.setState({
					locationData: Object.assign({}, this.state.locationData, { featureCollection })
				}); 

				resolve();  

			}); 

			/*----------  Style / Add event listeners to chooseLocationMap  ----------*/
			
			chooseLocationMap.data.addListener('mouseover', event => {
				
				const { selectedBorough } = this.state; 

				if (selectedBorough !== event.feature.getProperty('boro_name')) {

					chooseLocationMap.data.overrideStyle(event.feature, {
						fillColor: "#A8FFFC"
					}); 

				}

				this.updateHoveredBorough(event.feature); 
			
			});

			chooseLocationMap.data.addListener('mouseout', event => {

				const { selectedBorough } = this.state; 

				if (selectedBorough !== event.feature.getProperty('boro_name')) {

					chooseLocationMap.data.revertStyle(event.feature); 

				}

				this.updateHoveredBorough('');

			}); 	

			chooseLocationMap.data.addListener('click', event => {

				const { selectedBorough } = this.state; 

				if (selectedBorough !== event.feature.getProperty('boro_name')) {

					const { featureCollection } = this.state.locationData; 

					const allOtherBoroughs = featureCollection.filter(feature => feature.getProperty('boro_name') !== event.feature.getProperty('boro_name')); 

					allOtherBoroughs.forEach(feature => chooseLocationMap.data.revertStyle(feature)); 

				}

				chooseLocationMap.data.overrideStyle(event.feature, {
					fillColor: "#FFFFFF"
				}); 

				this.updateSelectedBorough(event.feature); 

			}); 

		}); 

	}

	nextTurn() {
		
		this.setRandomLocation() 

		.then(() => createPromiseTimeout(2000)) 

		.then(() => {

			return this.setState({
				promptText: 'Look closely...where in the city is this Street View?',  
				view: 'panorama'
			}); 

		})		

		.then(() => {

			const { spinner } = this.state; 

			spinner.start(); 

			spinner.once('revolution', () => this.onSpinnerRevolution()); 

			this.setState({
				totalRounds: this.state.totalRounds + 1
			});

		}); 


	}

	onCorrectBorough(panoramaBorough) {

		this.setState({
			promptText: `Correct!  The Street View shown was from ${stylizeBoroughName(panoramaBorough)}.`
		}); 
	
	}

	onGameOver() {

		window.console.log("GAME OVER."); 

		const totalCorrect = this.getTotalCorrectAnswers(); 

		return this.beforeNextTurn()

			.then(() => {

				return this.setState({
					promptText: `Game over.  You correctly guessed ${totalCorrect.toString()} / ${DEFAULT_TOTAL_ROUNDS.toString()} of the Street View locations.` 
				}); 

			}); 

	}

	onIncorrectBorough(selectedBorough, panoramaBorough) {

		this.setState({
			promptText: `Sorry, ${stylizeBoroughName(selectedBorough)} is incorrect.  The Street View shown was from ${stylizeBoroughName(panoramaBorough)}.`
		}); 

	}

	onMapMounted(mapCanvas) {

		this.setState({ mapCanvas }); 

	}

	onPanoramaMounted(panoramaCanvas) {

		this.setState({ panoramaCanvas }); 

	}

	onSpinnerRevolution() {

		const { spinner } = this.state; 

		spinner.stop(); 

		this.setState({
			mapMarkerVisible: false,  // Set to true for location guessing  
			promptText: "Where in the city was the last panorama located?", 
			view: 'map'
		}); 

	}

	onTransitionToGameplay() {

		this.nextTurn(); 

	}

	onTransitionToPregame() {

		const { lat, lng } = this.state.locationData.CENTER; 

		const mapLatLng = new google.maps.LatLng(lat, lng);  

		const nextState = {
			mapLatLng,   
			view: 'map'
		}; 

		this.setState(nextState); 

	}

	onTurnComplete() {

		this.addTurnToGameHistory(); 

		if (!(this.gameIsOver())) {

			this.beforeNextTurn()

				.then(() => this.nextTurn());  

		} else {

			this.onGameOver(); 

		}		

	}

	setRandomLocation() {		

		const { featureCollection } = this.state.locationData;  
		
		return getRandomPanoramaLocation(featureCollection) 

			.then(randomLocationDetails => {
				
				const { boroughName, randomLatLng } = randomLocationDetails; 

				window.console.log("randomLatLng.lat():", randomLatLng.lat()); 
				window.console.log("randomLatLng.lng():", randomLatLng.lng()); 

				return this.setState({ 
					panoramaBorough: boroughName,  
					panoramaLatLng: randomLatLng
				});   

			})

			.then(() => window.console.log("this.state:", this.state))

			.catch((...args) => `Caught error with args ${args}`); 				

	}

	startGame() {

		return this.setRandomLocation()
		
			.then(() => {

				setTimeout(() => {

					this.setState({
						gameStage: 'gameplay'
					}); 
				
				}, GAME_LOAD_DELAY);

			}); 

	}

	updateHoveredBorough(feature) {

		if (!(feature)) {

			return this.setState({
				hoveredBorough: ''
			}); 

		}

		const boroughName = feature.getProperty('boro_name'); 

		if (this.state.hoveredBorough === boroughName) return; 

		this.setState({
			hoveredBorough: boroughName
		}); 

	}

	updateSelectedBorough(feature) {

		const boroughName = feature.getProperty('boro_name'); 

		if (this.state.selectedBorough === boroughName) return; 

		this.setState({
			selectedBorough: boroughName
		}); 

	}

	/*----------  render()  ----------*/
	
	render() {

		return (
	
			<div id={ this.props.gameId }>
				<TwoBlocksView 
					mapCanvasId={ this.state.mapCanvasId }
					mapLatLng={ this.state.mapLatLng }
					mapMarker={ this.state.chooseLocationMarker }
					mapMarkerVisible={ this.state.mapMarkerVisible }
					onMapMounted={ this.onMapMounted.bind(this) }
					onPanoramaMounted={ this.onPanoramaMounted.bind(this) } 
					panorama={ this.state.panorama } 
					panoramaLatLng={ this.state.panoramaLatLng } 
					view={ this.state.view } 
				/>
				<TwoBlocksPrompt
					hoveredBorough={ this.state.hoveredBorough } 
					promptId={ this.props.promptId } 
					text={ this.state.promptText } 
				/>
				<TwoBlocksSubmitter 
					hoveredBorough={ this.state.hoveredBorough }
					evaluateFinalAnswer={ () => this.evaluateFinalAnswer() }
					selectedBorough={ this.state.selectedBorough }
				/>
			</div>
	
		); 

	}

}

TwoBlocks.propTypes = {
	gameId 				: React.PropTypes.string.isRequired, 	
	mapCanvasId 		: React.PropTypes.string.isRequired, 
	panoramaCanvasId 	: React.PropTypes.string.isRequired, 
	promptId 			: React.PropTypes.string.isRequired
}; 

// Assign default props to the constructor 
TwoBlocks.defaultProps = { 
	gameId 				: "twoBlocks", 
	mapCanvasId 		: "twoBlocks-map", 
	panoramaCanvasId 	: "twoBlocks-panorama", 
	promptId 			: "twoBlocks-prompt"
}; 

export default TwoBlocks; 
