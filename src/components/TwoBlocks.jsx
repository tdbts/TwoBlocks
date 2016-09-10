/* global document, google, window */

import React from 'react';
import TwoBlocksGame from '../TwoBlocksGame'; 
import TwoBlocksView from './TwoBlocksView';
import TwoBlocksPrompt from './TwoBlocksPrompt';
import TwoBlocksSubmitter from './TwoBlocksSubmitter'; 
import TwoBlocksReplayButton from './TwoBlocksReplayButton'; 
import stylizeBoroughName from '../stylizeBoroughName';
import createPromiseTimeout from '../createPromiseTimeout';  
import { events, heardKeys, keyEventMaps, ANSWER_EVALUATION_DELAY, DEFAULT_MAP_OPTIONS, DEFAULT_MAP_ZOOM, DEFAULT_TOTAL_ROUNDS, HOVERED_BOROUGH_FILL_COLOR, PANORAMA_LOAD_DELAY, SELECTED_BOROUGH_FILL_COLOR } from '../constants/constants'; 
import { isOneOf, isType } from '../utils/utils'; 

class TwoBlocks extends React.Component {

	constructor(props) {

		super(props); 

		// Define initial state 
		this.state = { 
			blockLevelMap 			: null, 
			boroughLevelMap 		: null, 
			blockLevelMapCanvas 	: null, 
			boroughLevelMapCanvas 	: null, 
			chooseLocationMap 		: null, 
			chooseLocationMarker 	: null, 
			choosingLocation 		: false, 
			gameInstance 			: null, 
			gameStage 				: null, 
			hoveredBorough 			: null, 
			locationData 			: null, 
			mapCanvas 				: null, 
			mapLatLng 				: null,
			mapMarkerVisible 		: false,
			mapType 				: 'city-level',   
			panorama 				: null, 
			panoramaBorough 		: null, 
			panoramaCanvas 			: null, 
			panoramaLatLng 			: null, 
			promptText 				: "Loading new TwoBlocks game...",
			selectedBorough 		: null, 
			showLocationMarker 		: null, 
			spinner 				: null, 
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

		this.showRandomPanorama(prevState); 

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

		chooseLocationMap.data.addListener('mouseover', event => this.onHoveredBorough(event.feature));

		chooseLocationMap.data.addListener('mouseout', event => {

			this.updateHoveredBorough('');

			this.styleNonHoveredBorough(event.feature); 

		}); 	

		chooseLocationMap.data.addListener('click', event => {

			const { gameInstance } = this.state; 

			if (gameInstance.gameOver()) return; 

			this.onSelectedBorough(event.feature);  

		}); 

		window.addEventListener('keydown', e => this.onKeypress(e)); 

	}

	addGameEventListeners(twoBlocks) {

		twoBlocks.on(events.GAME_STAGE, gameStage => this.setState({ gameStage })); 

		twoBlocks.on(events.HOST_LOCATION_DATA, locationData => this.setState({ locationData })); 

		twoBlocks.on(events.VIEW_CHANGE, viewState => this.setState(viewState)); 

		twoBlocks.once(events.GAME_COMPONENTS, gameComponents => this.setState(gameComponents)); 

		twoBlocks.on(events.NEXT_TURN, () => this.onNextTurn()); 

		twoBlocks.on(events.RANDOM_LOCATION, randomLocationDetails => this.onRandomLocation(randomLocationDetails)); 

		twoBlocks.on(events.CHOOSING_LOCATION, () => this.onChoosingLocation()); 

		twoBlocks.on(events.ANSWER_EVALUATED, answerDetails => this.onAnswerEvaluated(answerDetails)); 

		twoBlocks.on(events.CORRECT_BOROUGH, boroughName => this.onCorrectBorough(boroughName)); 

		twoBlocks.on(events.INCORRECT_BOROUGH, selectionDetails => this.onIncorrectBorough(selectionDetails)); 

		twoBlocks.on(events.TURN_COMPLETE, () => this.onTurnComplete()); 

		twoBlocks.on(events.GAME_OVER, () => this.onGameOver()); 

		twoBlocks.on(events.RESTART_GAME, () => this.restart()); 

	}

	evaluateFinalAnswer() {

		const { gameInstance, panoramaBorough, selectedBorough } = this.state; 

		gameInstance.evaluateFinalAnswer(panoramaBorough, selectedBorough); 

	}

	getFeatureByBoroughName(boroughName) {

		if (!(boroughName) || !(isType('string', boroughName))) return; 

		const { featureCollection } = this.state.locationData; 

		const feature = featureCollection.filter(feature => boroughName === feature.getProperty('boro_name')).pop(); 

		return feature; 

	}

	initializeTwoBlocks() {

		if (this.state.gameInstance) return;

		const { blockLevelMapCanvas, boroughLevelMapCanvas, mapCanvas, panoramaCanvas } = this.state;  

		if (!(blockLevelMapCanvas) || !(boroughLevelMapCanvas) || !(mapCanvas) || !(panoramaCanvas)) return; 

		[ mapCanvas, panoramaCanvas ].forEach(canvas => {

			if (!(canvas)) {

				throw new Error(`No element with selector '.${this.props[ mapCanvas === canvas ? "mapTwoBlocksClass" : "panoramaTwoBlocksClass" ]}' could be found on the page.`); 

			}

		}); 

		const twoBlocks = new TwoBlocksGame(mapCanvas, panoramaCanvas); 

		/*----------  Create block-level map  ----------*/
		
		const blockLevelMapOptions = Object.assign({}, DEFAULT_MAP_OPTIONS, { 
			mapTypeId: google.maps.MapTypeId.ROADMAP, 
			zoom: 16 
		}); 

		const blockLevelMap = new google.maps.Map(blockLevelMapCanvas, blockLevelMapOptions); 

		/*----------  Create borough-level map  ----------*/
		
		const boroughLevelMapOptions = Object.assign({}, DEFAULT_MAP_OPTIONS, {
			mapTypeId: google.maps.MapTypeId.ROADMAP, 
			zoom: 12
		}); 

		const boroughLevelMap = new google.maps.Map(boroughLevelMapCanvas, boroughLevelMapOptions); 


		this.addGameEventListeners(twoBlocks); 

		twoBlocks.startGame(); 

		const nextState = {
			blockLevelMap, 
			boroughLevelMap, 
			gameInstance: twoBlocks
		}; 

		this.setState(nextState); 

	}

	onAnswerEvaluated(answerDetails) {

		const actualLocationLatLng = {
			lat: answerDetails.randomLatLng.lat(), 
			lng: answerDetails.randomLatLng.lng()
		}; 

		const { boroughLevelMap, blockLevelMap } = this.state; 

		const randomLocationMarkerOptions = {
			animation: google.maps.Animation.BOUNCE, 
			map: boroughLevelMap, 
			position: new google.maps.LatLng(actualLocationLatLng), 
			visible: true				
		}; 

		return this.setState({

			mapType: 'borough-level', 
			showLocationMarker: new google.maps.Marker(randomLocationMarkerOptions) 

		}) 

		.then(() => createPromiseTimeout(ANSWER_EVALUATION_DELAY / 2))
 
		.then(() => {
			
			this.state.showLocationMarker.setMap(null); 

			randomLocationMarkerOptions.map = blockLevelMap; 

		})

		.then(() => this.setState({ 

			mapType: 'block-level', 
			showLocationMarker: new google.maps.Marker(randomLocationMarkerOptions)

		})); 

	}

	onChoosingLocation() {

		this.setState({
			choosingLocation: true, 
			mapMarkerVisible: false,  // Set to true for location guessing  
			promptText: "In which borough was the last panorama located?", 
			view: 'map'
		})

		.then(() => this.state.mapCanvas.blur()); 

	}

	onCorrectBorough(correctBoroughName) {

		this.setState({
			promptText: `Correct!  The Street View shown was from ${stylizeBoroughName(correctBoroughName)}.`
		}); 
	
	}

	onGameOver() {

		window.console.log("GAME OVER."); 

		const { gameInstance } = this.state; 

		const totalCorrect = gameInstance.totalCorrectAnswers(); 

		if (this.state.showLocationMarker) {

			this.state.showLocationMarker.setMap(null); 

		}

		return this.setState({
			mapType: 'city-level', 
			promptText: `Game over.  You correctly guessed ${totalCorrect.toString()} / ${DEFAULT_TOTAL_ROUNDS.toString()} of the Street View locations.` 
		}); 

	}

	onHoveredBorough(feature) {
			
		this.updateHoveredBorough(feature); 
		
		this.styleHoveredBorough(feature); 
	
	}

	onIncorrectBorough(selectionDetails) {

		const { correctBorough, selectedBorough } = selectionDetails; 

		this.setState({
			promptText: `Sorry, ${stylizeBoroughName(selectedBorough)} is incorrect.  The Street View shown was from ${stylizeBoroughName(correctBorough)}.`
		}); 

	}

	onKeypress(e) {
		
		e.preventDefault();  // Prevent arrows from scrolling page 

		if ('pregame' === gameStage) return; 

		const { gameInstance, gameStage, hoveredBorough, selectedBorough, view } = this.state;

		const { arrowKeyHoverMap, firstArrowKeyPressBoroughMap } = keyEventMaps; 

		if (!(isOneOf(heardKeys, e.key))) return;  

		if ('map' !== view) return; 

		if (gameInstance.gameOver() && ('Enter' === e.key)) {

			gameInstance.emit(events.RESTART_GAME); 

		}

		if (!(hoveredBorough)) {

			if (('Enter' === e.key) && selectedBorough) {

				return this.evaluateFinalAnswer(); 

			}

			const boroughList = firstArrowKeyPressBoroughMap[e.key]; 

			if (!(boroughList)) return; 

			const randomIndex = Math.floor(Math.random() * boroughList.length);  
			const boroughName = boroughList[randomIndex]; 

			const feature = this.getFeatureByBoroughName(boroughName); 

			this.onHoveredBorough(feature); 

		} else {

			if (('Enter' === e.key) && !(gameInstance.gameOver())) { 

				const selectedFeature = this.getFeatureByBoroughName(hoveredBorough); 

				return this.onSelectedBorough(selectedFeature); 

			}

			const hoveredBoroughArrowMap = arrowKeyHoverMap[hoveredBorough]; 

			const boroughList = hoveredBoroughArrowMap[e.key]; 

			if (!(boroughList)) return; 

			const randomIndex = Math.floor(Math.random() * boroughList.length); 

			const newHoveredBorough = boroughList[randomIndex]; 

			if (newHoveredBorough === hoveredBorough) return; 

			const featureToUnhover = this.getFeatureByBoroughName(hoveredBorough); 
			
			const featureToHover = this.getFeatureByBoroughName(newHoveredBorough); 

			this.styleNonHoveredBorough(featureToUnhover); 

			this.updateHoveredBorough(featureToHover); 

			this.styleHoveredBorough(featureToHover); 

		}

	}

	onMapMounted(mapType, mapCanvas) {

		const mapTypeToStatePropMap = {
			'block-level': 'blockLevelMapCanvas', 
			'borough-level': 'boroughLevelMapCanvas', 
			'city-level': 'mapCanvas'
		}; 

		const newState = {}; 
		const prop = mapTypeToStatePropMap[mapType]; 

		newState[prop] = mapCanvas; 

		this.setState(newState); 

	}

	onNextTurn() {

		if (this.state.showLocationMarker) {

			this.state.showLocationMarker.setMap(null); 
			
		}

		this.setState({
			choosingLocation: false, 
			mapType: 'city-level'
		}); 

	}

	onPanoramaMounted(panoramaCanvas) {

		this.setState({ panoramaCanvas }); 

	}

	onRandomLocation(randomLocationDetails) {

		const { boroughName, randomLatLng } = randomLocationDetails; 

		const { blockLevelMap, boroughLevelMap } = this.state; 

		blockLevelMap.panTo(randomLatLng); 
		boroughLevelMap.panTo(randomLatLng); 

		return this.setState({ 
			panoramaBorough: boroughName,  
			panoramaLatLng: randomLatLng
		});

	}

	onSelectedBorough(feature) {

		this.styleUnselectedBoroughs(feature); 
		
		this.styleSelectedBorough(feature);
		
		this.updateSelectedBorough(feature);

	}

	onSpinnerRevolution() {

		const { gameInstance, spinner } = this.state; 

		spinner.stop(); 

		gameInstance.emit(events.CHOOSING_LOCATION); 

	}

	onTurnComplete() {

		const { chooseLocationMap, gameInstance, locationData } = this.state; 

		const promptText = gameInstance.maximumRoundsPlayed() ? this.state.promptText : "Loading next panorama...";

		chooseLocationMap.data.revertStyle(); 
		chooseLocationMap.panTo(locationData.CENTER); 
		chooseLocationMap.setZoom(DEFAULT_MAP_ZOOM); 		

		this.setState({
			
			promptText, 
			selectedBorough: null
		
		}); 

	}

	restart() {

		return this.setState({
			gameInstance: null, 
			selectedBorough: null, 
			promptText: "Starting new game..."
		})

		.then(() => this.initializeTwoBlocks()); 

	}

	showRandomPanorama(prevState) {

		if (prevState.panoramaLatLng === this.state.panoramaLatLng) return;  // Don't show random panorama if the panoramaLatLng has not changed 

		return createPromiseTimeout(PANORAMA_LOAD_DELAY) 

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

			}); 		

	}

	styleHoveredBorough(borough) {
		
		const { chooseLocationMap, selectedBorough } = this.state; 

		// On hover, change the fill color of the borough, unless the 
		// borough is the selected borough. 
		if (selectedBorough !== borough.getProperty('boro_name')) {

			chooseLocationMap.data.overrideStyle(borough, {
				fillColor: HOVERED_BOROUGH_FILL_COLOR
			}); 

		}
	
	}

	styleSelectedBorough(borough) {

		const { chooseLocationMap } = this.state; 

		chooseLocationMap.data.overrideStyle(borough, {
			fillColor: SELECTED_BOROUGH_FILL_COLOR
		}); 	

	}

	styleUnselectedBoroughs(borough) {
			
		const { chooseLocationMap, locationData, selectedBorough } = this.state; 

		const clickedBoroughName = borough.getProperty('boro_name'); 

		if (selectedBorough === clickedBoroughName) return;  // Don't revert styles if the player clicks on the currently-selected borough  

		const { featureCollection } = locationData; 

		const unselectedBoroughs = featureCollection.filter(feature => feature.getProperty('boro_name') !== clickedBoroughName); 
		window.console.log("unselectedBoroughs:", unselectedBoroughs); 
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

		return this.setState({
			hoveredBorough: '', 
			selectedBorough: boroughName
		}); 

	}

	/*----------  render()  ----------*/
	
	render() {

		return (
	
			<div className={ this.props.gameTwoBlocksClass }>
				<TwoBlocksView 
					mapTwoBlocksClass={ this.props.mapTwoBlocksClass }
					mapLatLng={ this.state.mapLatLng }
					mapMarker={ this.state.chooseLocationMarker }
					mapMarkerVisible={ this.state.mapMarkerVisible }
					mapType={ this.state.mapType }
					onMapMounted={ this.onMapMounted.bind(this) }
					onPanoramaMounted={ this.onPanoramaMounted.bind(this) } 
					panorama={ this.state.panorama } 
					panoramaLatLng={ this.state.panoramaLatLng } 
					panoramaTwoBlocksClass={ this.props.panoramaTwoBlocksClass }
					twoBlocksClass={ this.props.viewTwoBlocksClass }
					view={ this.state.view } 
				/>
				<TwoBlocksPrompt
					choosingLocation={ this.state.choosingLocation }
					gameOver={ this.state.gameInstance && this.state.gameInstance.gameOver() }
					hoveredBorough={ this.state.hoveredBorough } 
					twoBlocksClass={ this.props.promptTwoBlocksClass } 
					text={ this.state.promptText } 
				/>
				<TwoBlocksSubmitter 
					hoveredBorough={ this.state.hoveredBorough }
					evaluateFinalAnswer={ () => this.evaluateFinalAnswer() }
					selectedBorough={ this.state.selectedBorough }
					twoBlocksClass={ this.props.submitterTwoBlocksClass }
				/>
				<TwoBlocksReplayButton 
					hidden={ 'postgame' !== this.state.gameStage }
					restart={ this.restart.bind(this) }
					twoBlocksClass={ this.props.replayButtonTwoBlocksClass }
				/>
			</div>
	
		); 

	}

}

TwoBlocks.propTypes = {
	gameTwoBlocksClass 			: React.PropTypes.string.isRequired, 	
	mapTwoBlocksClass 			: React.PropTypes.string.isRequired, 
	panoramaTwoBlocksClass 		: React.PropTypes.string.isRequired, 
	promptTwoBlocksClass 		: React.PropTypes.string.isRequired,
	replayButtonTwoBlocksClass 	: React.PropTypes.string.isRequired,
	submitterTwoBlocksClass 	: React.PropTypes.string.isRequired,
	viewTwoBlocksClass 			: React.PropTypes.string.isRequired
}; 

// Assign default props to the constructor 
TwoBlocks.defaultProps = { 
	gameTwoBlocksClass 			: "two-blocks", 
	mapTwoBlocksClass 			: "two-blocks-map", 
	panoramaTwoBlocksClass 		: "two-blocks-panorama", 
	promptTwoBlocksClass 		: "two-blocks-prompt", 
	replayButtonTwoBlocksClass 	: "two-blocks-replay-button", 
	submitterTwoBlocksClass 	: "two-blocks-submitter", 
	viewTwoBlocksClass 			: "two-blocks-view"
}; 

export default TwoBlocks; 
