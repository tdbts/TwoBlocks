/* global document, window */

import React from 'react';
import TwoBlocksGame from '../TwoBlocksGame'; 
import TwoBlocksView from './TwoBlocksView';
import TwoBlocksPrompt from './TwoBlocksPrompt';
import TwoBlocksSubmitter from './TwoBlocksSubmitter'; 
import stylizeBoroughName from '../stylizeBoroughName';
import createPromiseTimeout from '../createPromiseTimeout';  
import { DEFAULT_TOTAL_ROUNDS, PANORAMA_LOAD_DELAY } from '../constants/constants'; 

class TwoBlocks extends React.Component {

	constructor(props) {

		super(props); 

		// Define initial state 
		this.state = { 
			chooseLocationMap 		: null, 
			chooseLocationMarker 	: null, 
			gameHistory 			: [], 
			gameInstance 			: null, 
			gameStage 				: null, 
			hoveredBorough 			: null, 
			locationData 			: null, 
			mapCanvas 				: null, 
			mapLatLng 				: null,
			mapMarkerVisible 		: false,  
			panorama 				: null, 
			panoramaBorough 		: null, 
			panoramaCanvas 			: null, 
			panoramaLatLng 			: null, 
			promptText 				: 'loading...',
			selectedBorough 		: null, 
			spinner 				: null, 
			totalRounds 			: 0,  
			view 					: 'map' 
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

		this.addChooseLocationMapEventListeners(prevState); 

	}

	styleNonHoveredBorough(borough) {

		const { chooseLocationMap } = this.state;

		const { selectedBorough } = this.state; 

		if (selectedBorough !== borough.getProperty('boro_name')) {

			chooseLocationMap.data.revertStyle(borough); 

		}

	}

	addChooseLocationMapEventListeners(prevState) {

		const { chooseLocationMap } = this.state; 

		if (prevState.chooseLocationMap || !(chooseLocationMap)) return;
	
		chooseLocationMap.data.addListener('mouseover', event => {
			
			this.updateHoveredBorough(event.feature); 
			
			this.styleHoveredBorough(event.feature); 
		
		});

		chooseLocationMap.data.addListener('mouseout', event => {

			this.updateHoveredBorough('');

			this.styleNonHoveredBorough(event.feature); 

		}); 	

		chooseLocationMap.data.addListener('click', event => {

			this.updateSelectedBorough(event.feature); 

			this.styleUnselectedBoroughs(event.feature); 

			this.styleSelectedBorough(event.feature); 

		}); 

	}

	addGameEventListeners(twoBlocks) {

		twoBlocks.on('gamestage', gameStage => this.setState({ gameStage })); 

		twoBlocks.on('location_data', locationData => this.setState({ locationData })); 

		twoBlocks.on('view', viewState => this.setState(viewState)); 

		twoBlocks.once('game_components', gameComponents => this.setState(gameComponents)); 

		twoBlocks.on('random_location', randomLocationDetails => {

			const { boroughName, randomLatLng } = randomLocationDetails; 

			return this.setState({ 
				panoramaBorough: boroughName,  
				panoramaLatLng: randomLatLng
			})

			.then(() => createPromiseTimeout(PANORAMA_LOAD_DELAY)) 

			.then(() => {

				return this.setState({
					promptText: 'Look closely...which borough is this Street View from?',  
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

		}); 

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

	initializeTwoBlocks() {

		if (this.state.gameInstance) return; 

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
			gameInstance: twoBlocks
		}; 

		this.setState(nextState); 

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
			promptText: "In which borough was the last panorama located?", 
			view: 'map'
		}); 

	}

	onTurnComplete() {

		this.addTurnToGameHistory(); 

		if (!(this.gameIsOver())) {

			this.beforeNextTurn()

				.then(() => this.state.gameInstance.emit('next_turn'));  

		} else {

			this.onGameOver(); 

		}		

	}

	styleHoveredBorough(borough) {
		
		const { chooseLocationMap, selectedBorough } = this.state; 

		// On hover, change the fill color of the borough, unless the 
		// borough is the selected borough. 
		if (selectedBorough !== borough.getProperty('boro_name')) {

			chooseLocationMap.data.overrideStyle(borough, {
				fillColor: "#A8FFFC"
			}); 

		}
	
	}

	styleSelectedBorough(borough) {

		const { chooseLocationMap } = this.state; 

		chooseLocationMap.data.overrideStyle(borough, {
			fillColor: "#FFFFFF"
		}); 	

	}

	styleUnselectedBoroughs(borough) {
			
		const { chooseLocationMap, locationData, selectedBorough } = this.state; 

		const clickedBoroughName = borough.getProperty('boro_name'); 

		if (selectedBorough === clickedBoroughName) return;  // Don't revert styles if the player clicks on the currently-selected borough  

		const { featureCollection } = locationData; 

		const unselectedBoroughs = featureCollection.filter(feature => feature.getProperty('boro_name') !== clickedBoroughName); 

		unselectedBoroughs.forEach(feature => chooseLocationMap.data.revertStyle(feature)); 

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
