/* global document, google, window */

import React from 'react'; 
import TwoBlocksView from './TwoBlocksView';
import TwoBlocksInterchange from './TwoBlocksInterchange'; 
import PromptManager from './component-utils/PromptManager'; 
import createGameComponents from '../game-components/createGameComponents'; 
import Countdown from './component-utils/Countdown';
import removeStreetNameAnnotations from './component-utils/removeStreetNameAnnotations';  
import { boroughNames, events, heardKeys, keyEventMaps, workerMessages, ANSWER_EVALUATION_DELAY, DEFAULT_MAXIMUM_ROUNDS, HOVERED_BOROUGH_FILL_COLOR, KEY_PRESS_DEBOUNCE_TIMEOUT, MINIMUM_SPINNER_SCREEN_WIDTH, PANORAMA_LOAD_DELAY, SELECTED_BOROUGH_FILL_COLOR, STREETVIEW_COUNTDOWN_LENGTH, WINDOW_RESIZE_DEBOUNCE_TIMEOUT } from '../constants/constants'; 
import { createPromiseTimeout, debounce, isOneOf, isType } from '../utils/utils';  
import actions from '../actions/actions'; 

const promptManager = new PromptManager(); 

class TwoBlocks extends React.Component {

	constructor(props) {

		super(props); 

		// Define initial state 
		this.state = { 
			guessingLocation 		: false,
			countdownTimeLeft 		: null,    
			hoveredBorough 			: null,
			initialized 			: false,  
			interchangeHidden 		: false, 
			maps 					: null, 
			mapType 				: 'city',   
			mobile 					: null, 
			panorama 				: null,   
			prompt 					: null, 
			selectedBorough 		: null, 
			showLocationMarker 		: null
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

	/*----------  React Component Lifecycle Methods  ----------*/
	
	componentWillMount() {

		const mapCache = {
			element: null, 
			instance: null
		}; 

		const maps = {
			city: Object.assign({}, mapCache), 
			borough: Object.assign({}, mapCache), 
			block: Object.assign({}, mapCache)
		}; 

		const panorama = {
			borough: null, 
			element: null, 
			instance: null, 
			latLng: null, 
			spinner: null
		}; 

		const prompt = promptManager.pregame(); 
		
		const mobile = this.isMobile(); 

		if (mobile) {

			this.onMobileDeviceDetected(); 

		}

		this.setState({ 
			maps, 
			mobile, 
			panorama, 
			prompt 
		}); 

	}

	componentDidMount() {

		this.addDOMEventListeners(); 
		this.requestGeoJSON(); 

	}

	componentDidUpdate(prevProps, prevState) {  // eslint-disable-line no-unused-vars

		if (this.state.initialized) return; 

		const { service } = this.props; 
		const { mobile } = this.state; 

		// Child <TwoBlocksMap /> and <TwoBlocksPanorama /> 
		// components will call methods which update this 
		// component's state with the child components' 
		// respective DOM elements.  Once both elements 
		// exist in state, initialize TwoBlocks.  
		// If on mobile device, wait for Leaflet library to load 
		if (mobile && !(service.mobileMapLibraryLoaded())) {

			service.loadLeaflet()

				.then(() => this.initializeTwoBlocks()); 

		} else {

			this.initializeTwoBlocks(); 
			
		}	

	}

	/*----------  Custom Component Methods  ----------*/
	
	activateSpinner() {

		const { panorama } = this.state; 

		panorama.spinner.start(); 

		panorama.spinner.once('revolution', () => this.onSpinnerRevolution()); 

	}

	addCityMapEventListeners(mapInstance) {

		const { mobile } = this.state; 

		if (!(mapInstance) || mobile) return;  // Event listeners below only apply to desktop game instances  
 
		mapInstance.addListener('mouseover', event => this.onCityMapMouseover(event));

		mapInstance.addListener('mouseout', event => this.onCityMapMouseout(event)); 	

		mapInstance.addListener('click', event => this.onCityMapClick(event));  

	}

	addDOMEventListeners() {

		/*----------  Resize map on window 'resize' events  ----------*/

		const onWindowResize = debounce(this.onWindowResize.bind(this), WINDOW_RESIZE_DEBOUNCE_TIMEOUT); 

		/*----------  Handle key presses  ----------*/
		
		const onKeydown = debounce(this.onKeydown.bind(this), KEY_PRESS_DEBOUNCE_TIMEOUT); 

		/*----------  Handle touchmove events  ----------*/
		
		const onTouchMove = e => e.preventDefault(); 

		window.addEventListener('resize', onWindowResize); 

		window.addEventListener('keydown', onKeydown);

		if (this.state.mobile) {

			// Prevent drags from moving the game view layers 
			window.addEventListener('touchmove', onTouchMove); 

		} 

	}

	addGameEventListeners(twoBlocks) {

		twoBlocks.once(events.GAME_COMPONENTS, gameComponents => this.onGameComponents(gameComponents)); 

		twoBlocks.on(events.NEXT_TURN, () => this.onNextTurn()); 

		twoBlocks.on(events.RANDOM_LOCATION, randomLocationDetails => this.onRandomLocation(randomLocationDetails)); 

		twoBlocks.on(events.SHOWING_PANORAMA, () => this.onShowingPanorama()); 

		twoBlocks.on(events.CHOOSING_LOCATION, () => this.onGuessingLocation()); 

		twoBlocks.on(events.ANSWER_EVALUATED, answerDetails => this.onAnswerEvaluated(answerDetails)); 

		twoBlocks.on(events.CORRECT_BOROUGH, boroughName => this.onCorrectBorough(boroughName)); 

		twoBlocks.on(events.INCORRECT_BOROUGH, selectionDetails => this.onIncorrectBorough(selectionDetails)); 

		twoBlocks.on(events.TURN_COMPLETE, () => this.onTurnComplete()); 

		twoBlocks.on(events.GAME_OVER, () => this.onGameOver()); 

		twoBlocks.on(events.RESTART_GAME, () => this.restart()); 

	}

	addGameComponentEventListeners() {

		const { panorama } = this.state; 

		/*----------  Add listeners to panorama  ----------*/
		
		google.maps.event.addListener(panorama.instance, 'pano_changed', () => removeStreetNameAnnotations(panorama.instance)); 

	}

	evaluateFinalAnswer() {
 
		if (!(this.state.guessingLocation)) return; 

		const { panorama, selectedBorough } = this.state; 

		const { gameInstance } = this.props; 

		gameInstance.evaluateFinalAnswer(panorama.borough, selectedBorough); 

	}

	getBoroughName(borough) {

		let result = null; 

		if (borough.properties) {
			
			result = borough.properties.boro_name; 

		} else if (borough.getProperty) {

			result = borough.getProperty('boro_name'); 

		}

		return result; 

	}

	getDeviceClass() {

		return this.shouldUseDeviceOrientation() ? [ 'mobile' ].join(' ').trim() : ''; 

	}

	getFeatureByBoroughName(boroughName) {

		if (!(boroughName) || !(isType('string', boroughName))) return; 

		const { featureCollection } = this.props.locationData; 

		const feature = featureCollection.filter(feature => boroughName === this.getBoroughName(feature))[0]; 

		return feature; 

	}

	initializeTwoBlocks() {

		if (this.state.initialized) return;  // Game already initialized 

		const { maps, mobile, panorama } = this.state;  

		const { gameInstance, locationData, store } = this.props; 

		if (!(this.requiredDOMElementsExist())) return;  // DOM elements must exist before the game instance can be initialized 

		/*----------  Create Game Components  ----------*/
						
		const gameComponents = createGameComponents({
			maps,  
			locationData, 
			mobile,  
			panorama 
		}); 

		window.console.log("gameComponents:", gameComponents); 

		/*----------  Start Game Instance  ----------*/
		
		this.addGameEventListeners(gameInstance); 

		gameInstance.start(); 
		
		/*----------  Show Map  ----------*/
		
		const view = 'map'; 

		store.dispatch({ type: actions.SHOW_MAP });

		gameInstance.emit(events.VIEW_CHANGE, { view }); 		

		/*----------  Update State  ----------*/
		
		const nextState = {
			...gameComponents,  
			initialized: true
		}; 

		return this.setState(nextState)

			.then(() => this.addGameComponentEventListeners())

			.then(() => this.addCityMapEventListeners(this.state.maps.city.instance))

			.then(() => gameInstance.emit(events.GAME_COMPONENTS, gameComponents))

			.then(() => {

				if (this.state.mobile) {

					gameInstance.emit(events.VIEW_READY); 

				}

			}); 	

	}

	isMobile() {

		return this.shouldUseDeviceOrientation(); 

	}

	onAnswerEvaluated(answerDetails) {

		const { lat, lng } = answerDetails.randomLatLng; 

		const { maps, showLocationMarker, mobile } = this.state; 

		showLocationMarker.setLocation(lat, lng); 
		showLocationMarker.placeOnMap(maps.borough.instance); 

		return Promise.resolve()

			.then(() => {

				if (!(this.state.mobile)) return; 

				return createPromiseTimeout(1500);  // Communicate result of answer evaluation 

			})

			.then(() => this.setState({

				interchangeHidden: mobile, 
				guessingLocation: false, 
				mapType: 'borough'

			}))

			.then(() => createPromiseTimeout(ANSWER_EVALUATION_DELAY / 2))

			.then(() => {

				if (mobile) {
					
					maps.borough.instance.removeLayer(showLocationMarker.marker);
					
				} 

				showLocationMarker.placeOnMap(maps.block.instance); 

			})

			.then(() => this.setState( { 
			
				mapType: 'block' 
			
			})); 

	}

	onButtonClick(type) {

		const { props } = this; 

		if ('BOROUGH_SUBMISSION' === type) {

			this.evaluateFinalAnswer(); 

		} else if ('GO_BACK' === type) {

			this.setState({ selectedBorough: null }); 

		} else if ('RESTART' === type) {

			props.gameInstance.emit(events.RESTART_GAME); 

		} else if (isOneOf(boroughNames, type)) {

			this.onMobileBoroughSelection(type); 

		}

	}

	onGuessingLocation() {

		const { maps, mobile } = this.state; 

		const { store } = this.props; 

		if (!(mobile)) {

			maps.city.instance.onGuessingLocation(); 
		
		}

		store.dispatch({
			type: actions.SHOW_MAP
		}); 

		return this.setState({
			guessingLocation: true, 
			hoveredBorough: '', 
			interchangeHidden: false,  
			prompt: promptManager.guessingLocation()
		})

		.then(() => maps.city.element.blur()); 

	}

	onCityMapClick(event) {

		const { gameInstance } = this.props; 

		if (gameInstance.gameOver()) return; 

		this.onSelectedBorough(event.feature);  
	
	}

	onCityMapMouseout(event) {
			
		const { guessingLocation, gameOver } = this.state; 

		this.updateHoveredBorough('');

		this.styleNonHoveredBorough(event.feature); 

		if (!(gameOver) && guessingLocation) {

			this.setState({

				prompt: promptManager.guessingLocation() 

			}); 

		}

	}

	onCityMapMouseover(event) {

		this.onConsideredBorough(event.feature); 

	}

	onConsideredBorough(feature) {

		const { guessingLocation, gameOver, hoveredBorough } = this.state; 

		// Unhover the currently-hovered borough 
		const featureToUnhover = this.getFeatureByBoroughName(hoveredBorough); 
		
		this.styleNonHoveredBorough(featureToUnhover);
			
		this.updateHoveredBorough(feature); 
		
		this.styleHoveredBorough(feature); 

		if (!(gameOver) && guessingLocation) {

			const consideredBorough = this.getBoroughName(feature); 

			this.setState({

				prompt: promptManager.guessingLocation(consideredBorough)
			
			}); 

		}

	}

	onCorrectBorough(boroughName) {

		this.setState({
			prompt: promptManager.correctBorough(boroughName)
		}); 
	
	}

	onGameComponents(gameComponents) {

		return this.setState({
			...gameComponents, 
			showLocationMarker: gameComponents.mapMarker
		});
	}

	onGameOver() {

		window.console.log("GAME OVER."); 

		const { gameInstance } = this.props; 

		const { showLocationMarker } = this.state; 
 
		const totalCorrect = gameInstance.totalCorrectAnswers(); 

		showLocationMarker.hide(); 

		return this.setState({
			mapType: 'city',
			prompt: promptManager.gameOver(totalCorrect, DEFAULT_MAXIMUM_ROUNDS) 
		}); 

	}

	onGeoJSONReceived(geoJSON) {

		const { maps, mobile } = this.state; 

		const { gameInstance, locationData } = this.props;  

		// Race condition circumvention: If the cityMap does not 
		// yet exist, wait until the 'GAME_COMPONENTS' event fires to execute 
		// the rest of the method body.  
		if (!(maps.city.instance)) {
			
			gameInstance.once(events.GAME_COMPONENTS, () => this.onGeoJSONReceived(geoJSON)); 

			return; 

		} 

		if (!(mobile)) {

			// Add GeoJSON to the cityMap if not on mobile.  The 'addGeoJson()' method 
			// returns the feature collection.  Each borough is a feature.  
			const featureCollection = maps.city.instance.onGeoJSONReceived(geoJSON); 

			locationData.featureCollection = featureCollection; 

		}

		gameInstance.emit(events.VIEW_READY); 

	}

	onIncorrectBorough(selectionDetails) {

		const { correctBorough, selectedBorough } = selectionDetails; 

		this.setState({
			prompt: promptManager.incorrectBorough(selectedBorough, correctBorough)
		}); 

	}

	onKeydown(e) {

		e.preventDefault();  // Prevent arrows from scrolling page 

		const { hoveredBorough, mobile, selectedBorough } = this.state;

		if (mobile) return;  // Keypresses only apply to desktop 

		const { gameInstance, store } = this.props; 

		const { view } = store.getState(); 

		const { gameStage } = store.getState(); 

		if ('pregame' === gameStage) return;  // (For now) keypresses do not have any effect in the 'pregame' stage.  

		const { arrowKeyHoverMap, firstArrowKeyPressBoroughMap } = keyEventMaps; 

		if (!(isOneOf(heardKeys, e.key))) return;  // Only react to key presses we're listening for. 

		if ('map' !== view) return;  // Don't react to key presses if the map is not showing (for now). 

		if ('Enter' === e.key) {

			if (gameInstance.gameOver()) {

				gameInstance.emit(events.RESTART_GAME); 

			} else if (hoveredBorough) {

				const selectedFeature = this.getFeatureByBoroughName(hoveredBorough); 

				this.onSelectedBorough(selectedFeature); 		

			} else if (selectedBorough) {

				this.evaluateFinalAnswer(); 

			}

		} else {

			let boroughList = null; 

			if (hoveredBorough) {

				const hoveredBoroughArrowMap = arrowKeyHoverMap[hoveredBorough]; 

				boroughList = hoveredBoroughArrowMap[e.key]; 

			} else {

				boroughList = firstArrowKeyPressBoroughMap[e.key];

			}

			if (!(boroughList)) return; 

			const randomIndex = Math.floor(Math.random() * boroughList.length); 

			const boroughName = boroughList[randomIndex]; 

			if (boroughName === hoveredBorough) return; 
			
			const feature = this.getFeatureByBoroughName(boroughName); 

			this.onConsideredBorough(feature); 	

		}

	}

	onMapMounted(mapType, mapCanvas) {

		const { maps } = this.state; 

		const newState = {
			maps: Object.assign({}, maps)
		}; 

		newState.maps[mapType].element = mapCanvas; 

		this.setState(newState); 

	}

	onMobileBoroughSelection(boroughName) {

		this.updateSelectedBorough(boroughName);  

	}

	onMobileDeviceDetected() {

		const { service } = this.props; 

		service.loadLeaflet()

			.then(() => window.console.log("window.L:", window.L)); 

	}

	onNextTurn() {

		const { showLocationMarker } = this.state; 
		
		showLocationMarker.hide();

		this.setState({

			mapType: 'city'
		
		});

	}

	onPanoramaMounted(element) {

		const { panorama } = this.state; 

		this.setState({ 
			panorama: Object.assign({}, panorama, { element })
		}); 

	}

	onRandomLocation(randomLocationDetails) {

		const { boroughName, randomLatLng } = randomLocationDetails; 

		const { maps, panorama } = this.state; 

		maps.block.instance.panTo(randomLatLng); 
		maps.borough.instance.panTo(randomLatLng); 

		return this.setState({ 
			panorama: Object.assign({}, panorama, { 
				borough: boroughName, 
				latLng: randomLatLng 
			}) 
		})

		.then(() => this.showRandomPanorama()); 

	}

	onSelectedBorough(feature) {

		const { guessingLocation } = this.state; 

		if (!(guessingLocation)) return; 

		this.styleUnselectedBoroughs(feature); 
		
		this.styleSelectedBorough(feature);
		
		const boroughName = this.getBoroughName(feature); 

		this.updateSelectedBorough(boroughName);

	}

	onShowingPanorama() {

		const { maps, mobile } = this.state; 

		if (mobile) return; 

		maps.city.instance.onShowingPanorama();  

	}

	onSpinnerRevolution() {

		const { panorama } = this.state; 

		const { gameInstance } = this.props; 

		panorama.spinner.stop(); 

		gameInstance.emit(events.CHOOSING_LOCATION); 

	}

	onTurnComplete() {

		const { maps, mobile, showLocationMarker } = this.state; 

		const { gameInstance, locationData } = this.props; 

		const prompt = gameInstance.maximumRoundsPlayed() ? this.state.prompt : promptManager.turnComplete(); 

		if (!(mobile)) {

			maps.city.instance.onTurnComplete(); 
		
		} else {

			maps.block.instance.removeLayer(showLocationMarker.marker); 

		}


		const centerLatLng = new google.maps.LatLng(locationData.CENTER.lat, locationData.CENTER.lng); 		

		// Re-center map in case player moved it 
		maps.city.instance.setCenter(centerLatLng);

		this.setState({
			
			prompt, 
			interchangeHidden: false, 
			selectedBorough: null
		
		}); 

	}

	onWindowResize() {

		const { maps } = this.state;

		const { locationData } = this.props; 

		const { CENTER } = locationData; 

		const centerLatLng = new google.maps.LatLng(CENTER.lat, CENTER.lng); 		

		maps.city.instance.setCenter(centerLatLng);

		this.setState({
			mobile: this.isMobile()
		}); 

	}

	// If on desktop, request the GeoJSON data from the web worker in order to 
	// show the borough boundaries on the map.  Add a listener to handle the 
	// data once the worker has sent it, and then make the request for the data.  
	// If there is no worker, move on using the GeoJSON member of th game instance.  
	requestGeoJSON() {

		const { mobile } = this.state; 

		if (mobile) return;  // Request GeoJSON only on desktop (for map)

		const { gameInstance, worker } = this.props; 

		return gameInstance.geoJSONLoaded() 

			.then(() => {

				if (worker) {

					/*----------  onGeoJSONSent()  ----------*/

					const onGeoJSONSent = event => {

						const { message, payload } = event.data; 

						if (workerMessages.SENDING_GEO_JSON !== message) return; 

						this.onGeoJSONReceived(payload);  

						worker.removeEventListener('message', onGeoJSONSent); 

					}; 

					// Assign the event listener before posting message 
					worker.addEventListener('message', onGeoJSONSent); 

					// Request GeoJSON from web worker 
					worker.postMessage({

						message: workerMessages.REQUEST_GEO_JSON

					}); 

				} else {

					this.onGeoJSONReceived(gameInstance.locationData.featureCollection); 

				}

			}); 	

	}

	requiredDOMElementsExist() {

		const { maps, panorama } = this.state; 

		return maps.block.element && maps.borough.element && maps.city.element && panorama.element; 		

	}

	restart() {

		const { gameInstance, store } = this.props; 

		const view = 'map'; 

		store.dispatch({ type: actions.SHOW_MAP });

		gameInstance.emit(events.VIEW_CHANGE, { view }); 		

		return this.setState({  
			selectedBorough: null, 
			prompt: promptManager.restart()
		}); 

	}

	shouldUseDeviceOrientation() {

		const conditions = [

			!!(window.DeviceOrientationEvent) || !!(window.DeviceMotionEvent), 
			(window.screen.width < MINIMUM_SPINNER_SCREEN_WIDTH) || /iPad/g.test(window.navigator.userAgent)

		]; 

		return conditions.every(condition => !!condition); 

	} 

	showRandomPanorama() {
	
		const { gameInstance, store } = this.props; 

		const view = 'panorama'; 

		return createPromiseTimeout(PANORAMA_LOAD_DELAY) 

			.then(() => {

				store.dispatch({ 
					type: actions.SHOW_PANORAMA
				}); 

				gameInstance.emit(events.SHOWING_PANORAMA); 
				gameInstance.emit(events.VIEW_CHANGE, { view }); 

				return this.setState({
			
					prompt: promptManager.showingPanorama()
				
				}); 

			})

			.then(() => (this.state.mobile) ? createPromiseTimeout(PANORAMA_LOAD_DELAY) : null)

			.then(() => {

				if (this.isMobile()) {

					this.startStreetviewCountdown();  					

					this.setState({
						interchangeHidden: true
					}); 

				} else {

					this.activateSpinner(); 

				}

			}); 		

	}

	startStreetviewCountdown() {

		const { gameInstance } = this.props; 

		const countdown = new Countdown(STREETVIEW_COUNTDOWN_LENGTH); 

		countdown.on('tick', timeLeft => {

			this.setState({
				countdownTimeLeft: timeLeft
			}); 

		}); 

		countdown.on('end', () => gameInstance.emit(events.CHOOSING_LOCATION)); 

		return this.setState({
				
				countdownTimeLeft: STREETVIEW_COUNTDOWN_LENGTH
			
			})

			.then(() => countdown.start()); 

	}

	styleHoveredBorough(borough) {

		const { maps, mobile, selectedBorough } = this.state; 

		if (mobile) return; 

		// On hover, change the fill color of the borough, unless the 
		// borough is the selected borough. 
		if (selectedBorough !== this.getBoroughName(borough)) {

			maps.city.instance.onConsideredBorough(borough, {
				fillColor: HOVERED_BOROUGH_FILL_COLOR
			}); 

		}
	
	}

	styleNonHoveredBorough(borough) {

		if (!(borough)) return; 

		const { maps, mobile, selectedBorough } = this.state;

		if (mobile) return; 

		if (selectedBorough !== this.getBoroughName(borough)) {

			maps.city.instance.unselectBorough(borough); 

		}

	}

	styleSelectedBorough(borough) {

		const { maps, mobile } = this.state; 

		if (mobile) return; 

		maps.city.instance.onSelectedBorough(borough, {
			fillColor: SELECTED_BOROUGH_FILL_COLOR
		}); 

	}

	styleUnselectedBoroughs(borough) {
			
		const { maps, mobile, selectedBorough } = this.state; 

		if (mobile) return; 

		const { locationData } = this.props; 

		const clickedBoroughName = this.getBoroughName(borough); 

		if (selectedBorough === clickedBoroughName) return;  // Don't revert styles if the player clicks on the currently-selected borough  

		const { featureCollection } = locationData; 

		if (!(featureCollection)) return; 

		const unselectedBoroughs = featureCollection.filter(feature => this.getBoroughName(feature) !== clickedBoroughName); 
 
		unselectedBoroughs.forEach(feature => maps.city.instance.unselectBorough(feature)); 

	}

	updateHoveredBorough(feature) {

		if (!(feature)) {  // No borough is currently hovered.  Modify state to reflect this. 

			return this.setState({
				hoveredBorough: ''
			}); 

		}

		const boroughName = this.getBoroughName(feature); 

		if (this.state.hoveredBorough === boroughName) return;  // Don't change state if the hovered borough has not changed. 

		return this.setState({
			hoveredBorough: boroughName
		}); 

	}

	updateSelectedBorough(boroughName) {

		if (this.state.selectedBorough === boroughName) return; 

		return this.setState({
			hoveredBorough: '', 
			selectedBorough: boroughName
		}); 

	}

	/*----------  render()  ----------*/
	
	render() {

		const { props } = this;
		const { state } = this;  
		const { store } = props; 
 
		return (
	
			<div className={ [ props.TWO_BLOCKS_CLASS, this.getDeviceClass() ].join(' ') }>
				<TwoBlocksView 
					blockLevelMap={ state.maps.block.instance }
					boroughLevelMap={ state.maps.borough.instance }
					cityLevelMap={ state.maps.city.instance }
					countdownTimeLeft={ state.countdownTimeLeft }
					interchangeHidden={ state.interchangeHidden }
					maps={ state.maps }
					mapType={ state.mapType }
					mobile={ state.mobile }
					onMapMounted={ this.onMapMounted.bind(this) }
					onPanoramaMounted={ this.onPanoramaMounted.bind(this) }  
					panorama={ state.panorama }
					view={ store ? store.getState().view : 'map' } 
				/>
				<TwoBlocksInterchange 
					guessingLocation={ state.guessingLocation }
					gameOver={ props.gameInstance && props.gameInstance.gameOver() }
					hidden={ state.interchangeHidden }
					hideReplayButton={ !(store) || !(store.getState().gameOver) }
					hoveredBorough={ state.hoveredBorough }
					mobile={ state.mobile }
					onButtonClick={ this.onButtonClick.bind(this) }
					prompt={ state.prompt }
					selectedBorough={ state.selectedBorough }
					twoBlocksClass={ props.promptTwoBlocksClass }
				/>
			</div>
	
		); 

	}

}

TwoBlocks.propTypes = {
	TWO_BLOCKS_CLASS 			: React.PropTypes.string.isRequired, 	
	service 					: React.PropTypes.object.isRequired, 
	store 						: React.PropTypes.object.isRequired, 
	worker 						: React.PropTypes.object, 
	gameInstance 				: React.PropTypes.object.isRequired, 
	locationData 				: React.PropTypes.object.isRequired
}; 

// Assign default props to the constructor 
TwoBlocks.defaultProps = { 
	TWO_BLOCKS_CLASS: "two-blocks" 
}; 

export default TwoBlocks; 
