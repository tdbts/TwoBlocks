/* global document, google, window, L */

import React from 'react'; 
import TwoBlocksView from './TwoBlocksView';
import TwoBlocksInterchange from './TwoBlocksInterchange'; 
import stylizeBoroughName from '../stylizeBoroughName';
import createGameComponents from '../createGameComponents'; 
import createPromiseTimeout from '../createPromiseTimeout';  
import Countdown from '../Countdown';
import removeStreetNameAnnotations from '../removeStreetNameAnnotations';  
import { events, heardKeys, keyEventMaps, workerMessages, ANSWER_EVALUATION_DELAY, DEFAULT_MAP_ZOOM, DEFAULT_MAXIMUM_ROUNDS, HOVERED_BOROUGH_FILL_COLOR, KEY_PRESS_DEBOUNCE_TIMEOUT, MINIMUM_SPINNER_SCREEN_WIDTH, PANORAMA_LOAD_DELAY, SELECTED_BOROUGH_FILL_COLOR, STREETVIEW_COUNTDOWN_LENGTH, WINDOW_RESIZE_DEBOUNCE_TIMEOUT } from '../constants/constants'; 
import { debounce, isOneOf, isType } from '../utils/utils';  
import actions from '../actions/actions'; 

class TwoBlocks extends React.Component {

	constructor(props) {

		super(props); 

		// Define initial state 
		this.state = { 
			blockLevelMap 			: null, 
			boroughLevelMap 		: null, 
			blockLevelMapCanvas 	: null, 
			boroughLevelMapCanvas 	: null, 
			cityMap 				: null, 
			cityMapMarker 			: null, 
			choosingLocation 		: false,
			countdownTimeLeft 		: null,    
			hoveredBorough 			: null,
			initialized 			: false,  
			interchangeHidden 		: false, 
			mapCanvas 				: null, 
			mapConfig 				: null, 
			mapMarkerVisible 		: false,
			mapType 				: 'city-level',   
			mobile 					: null, 
			panorama 				: null, 
			panoramaBorough 		: null, 
			panoramaCanvas 			: null, 
			panoramaLatLng 			: null, 
			promptText 				: "Loading new TwoBlocks game...",
			selectedBorough 		: null, 
			showLocationMarker 		: null, 
			spinner 				: null
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

	componentWillMount() {

		const mobile = this.isMobile(); 

		if (mobile) {

			this.onMobileDeviceDetected(); 

		}

		this.setState({ mobile }); 

	}

	componentDidMount() {

		this.addDOMEventListeners(); 
		this.requestGeoJSON(); 

	}

	componentDidUpdate(prevProps, prevState) {  // eslint-disable-line no-unused-vars

		// Child <TwoBlocksMap /> and <TwoBlocksPanorama /> 
		// components will call methods which update this 
		// component's state with the child components' 
		// respective DOM elements.  Once both elements 
		// exist in state, initialize TwoBlocks.  
		if (!(this.state.initialized)) {

			this.initializeTwoBlocks(); 
		
		}

		this.addCityMapEventListeners(prevState); 

	}

	styleNonHoveredBorough(borough) {

		if (!(borough)) return; 

		const { cityMap, mobile, selectedBorough } = this.state;

		if (mobile) return; 

		if (selectedBorough !== this.getBoroughName(borough)) {

			cityMap.unselectBorough(borough); 

		}

	}

	addCityMapEventListeners(prevState) {

		const { cityMap, mobile } = this.state; 

		if (mobile) return;  // Event listeners below only apply to desktop game instances  

		// If we have already added listeners to the city map, 
		// or the city map does not yet exist, exit. 
		if (prevState.cityMap || !(cityMap)) return;

		cityMap.map.data.addListener('mouseover', event => this.onHoveredBorough(event.feature));

		cityMap.map.data.addListener('mouseout', event => {

			this.updateHoveredBorough('');

			this.styleNonHoveredBorough(event.feature); 

		}); 	

		cityMap.map.data.addListener('click', event => {

			const { gameInstance } = this.props; 

			if (gameInstance.gameOver()) return; 

			this.onSelectedBorough(event.feature);  

		}); 

	}

	addDOMEventListeners() {

		/*----------  Resize map on window 'resize' events  ----------*/

		const onWindowResize = debounce(this.onWindowResize.bind(this), WINDOW_RESIZE_DEBOUNCE_TIMEOUT); 

		/*----------  Handle key presses  ----------*/
		
		const onKeyPress = debounce(this.onKeypress.bind(this), KEY_PRESS_DEBOUNCE_TIMEOUT); 

		/*----------  Handle touchmove events  ----------*/
		
		const onTouchMove = e => e.preventDefault(); 

		window.addEventListener('resize', onWindowResize); 

		window.addEventListener('keydown', onKeyPress);

		if (this.state.mobile) {

			// Prevent drags from moving the game view layers 
			window.addEventListener('touchmove', onTouchMove); 

		} 

	}

	addGameEventListeners(twoBlocks) {

		// twoBlocks.once(events.GEO_JSON_LOADED, geoJSON => this.onGeoJSONReceived(geoJSON)); 

		twoBlocks.once(events.GAME_COMPONENTS, gameComponents => this.onGameComponents(gameComponents)); 

		twoBlocks.on(events.NEXT_TURN, () => this.onNextTurn()); 

		twoBlocks.on(events.RANDOM_LOCATION, randomLocationDetails => this.onRandomLocation(randomLocationDetails)); 

		twoBlocks.on(events.SHOWING_PANORAMA, () => this.onShowingPanorama()); 

		twoBlocks.on(events.CHOOSING_LOCATION, () => this.onChoosingLocation()); 

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
		
		google.maps.event.addListener(panorama, 'pano_changed', () => removeStreetNameAnnotations(panorama)); 

	}

	evaluateFinalAnswer() {
 
		if (!(this.state.choosingLocation)) return; 

		const { panoramaBorough, selectedBorough } = this.state; 

		const { gameInstance } = this.props; 

		gameInstance.evaluateFinalAnswer(panoramaBorough, selectedBorough); 

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

		const { blockLevelMapCanvas, boroughLevelMapCanvas, mapCanvas, mobile, panoramaCanvas } = this.state;  

		const { gameInstance, locationData, service, store } = this.props; 

		// If on mobile device, wait for Leaflet library to load 
		if (mobile && !(window.L)) {

			return service.loadLeaflet()

				.then(() => this.initializeTwoBlocks()); 

		}

		if (!(blockLevelMapCanvas) || !(boroughLevelMapCanvas) || !(mapCanvas) || !(panoramaCanvas)) return;  // DOM elements must exist before the game instance can be initialized 

		[ mapCanvas, panoramaCanvas ].forEach(canvas => {

			if (!(canvas)) {

				throw new Error(`No element with selector '.${this.props[ mapCanvas === canvas ? "mapTwoBlocksClass" : "panoramaTwoBlocksClass" ]}' could be found on the page.`); 

			}

		}); 

		/*----------  Create Game Components  ----------*/
						
		const gameComponents = createGameComponents({
			blockLevelMapCanvas, 
			boroughLevelMapCanvas, 
			locationData, 
			mapCanvas, 
			mobile,  
			panoramaCanvas,	
			mapMarkerVisible: false 
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

		const actualLocationLatLng = {
			lat: answerDetails.randomLatLng.lat, 
			lng: answerDetails.randomLatLng.lng
		}; 

		const { boroughLevelMap, blockLevelMap, showLocationMarker, mobile } = this.state; 

		const showLocationMarkerPosition = mobile ? L.latLng(actualLocationLatLng.lat, actualLocationLatLng.lng) : new google.maps.LatLng(actualLocationLatLng); 

		if (mobile) {

			showLocationMarker.setOpacity(1); 
			showLocationMarker.setLatLng(showLocationMarkerPosition); 
			showLocationMarker.addTo(boroughLevelMap); 

		} else {

			showLocationMarker.setVisible(true); 
			showLocationMarker.setAnimation(mobile ? null : google.maps.Animation.BOUNCE); 
			showLocationMarker.setMap(boroughLevelMap); 
			showLocationMarker.setPosition(showLocationMarkerPosition); 
		
		}

		return Promise.resolve()

			.then(() => {

				if (!(this.state.mobile)) return; 

				return createPromiseTimeout(1500);  // Communicate result of answer evaluation 

			})

			.then(() => this.setState({

				interchangeHidden: mobile, 
				choosingLocation: false, 
				mapType: 'borough-level'

			}))

			.then(() => createPromiseTimeout(ANSWER_EVALUATION_DELAY / 2))

			.then(() => {

				if (mobile) {
					
					boroughLevelMap.removeLayer(showLocationMarker);

					showLocationMarker.setOpacity(1); 
					showLocationMarker.setLatLng(showLocationMarkerPosition);
					showLocationMarker.addTo(blockLevelMap); 

				} else {

					showLocationMarker.setMap(blockLevelMap);
					showLocationMarker.setAnimation(mobile ? null : google.maps.Animation.BOUNCE);  // Need to reset animation animation if map changes 
				
				}

			})

			.then(() => this.setState( { 
			
				mapType: 'block-level' 
			
			})); 

	}

	onChoosingLocation() {

		const { cityMap, mobile } = this.state; 

		const { store } = this.props; 

		if (!(mobile)) {

			cityMap.onChoosingLocation(); 
		
		}

		store.dispatch({
			type: actions.SHOW_MAP
		}); 

		return this.setState({
			choosingLocation: true, 
			hoveredBorough: '', 
			interchangeHidden: false, 
			mapMarkerVisible: false,  // Set to true for location guessing  
			promptText: "In which borough was the last panorama located?"
		})

		.then(() => this.state.mapCanvas.blur()); 

	}

	onCorrectBorough(correctBoroughName) {

		this.setState({
			promptText: `Correct!  The Street View shown was from ${stylizeBoroughName(correctBoroughName)}.`
		}); 
	
	}

	onGameComponents(gameComponents) {

		return this.setState({
			...gameComponents, 
			showLocationMarker: gameComponents.cityMapMarker
		});
	}

	onGameOver() {

		window.console.log("GAME OVER."); 

		const { gameInstance } = this.props; 

		const { mobile, showLocationMarker } = this.state; 
 
		const totalCorrect = gameInstance.totalCorrectAnswers(); 

		if (showLocationMarker) {

			if (mobile) {

				showLocationMarker.setOpacity(0); 

			} else {

				showLocationMarker.setMap(null); 
			
			}

		}

		return this.setState({
			mapType: 'city-level', 
			promptText: `Game over.  You correctly guessed ${totalCorrect.toString()} / ${DEFAULT_MAXIMUM_ROUNDS.toString()} of the Street View locations.` 
		}); 

	}

	onGeoJSONReceived(geoJSON) {

		const { cityMap, mobile } = this.state; 

		const { gameInstance, locationData } = this.props;  

		// Race condition circumvention: If the cityMap does not 
		// yet exist, wait until the 'GAME_COMPONENTS' event fires to execute 
		// the rest of the method body.  
		if (!(cityMap)) {
			
			gameInstance.once(events.GAME_COMPONENTS, () => this.onGeoJSONReceived(geoJSON)); 

		} else {

			if (!(mobile)) {

				// Add GeoJSON to the cityMap if not on mobile.  The 'addGeoJson()' method 
				// returns the feature collection.  Each borough is a feature.  
				const featureCollection = cityMap.onGeoJSONReceived(geoJSON); 

				locationData.featureCollection = featureCollection; 

			}

			gameInstance.emit(events.VIEW_READY); 
			
		}

	}

	onHoveredBorough(feature) {

		const { hoveredBorough } = this.state; 

		const featureToUnhover = this.getFeatureByBoroughName(hoveredBorough); 
		
		this.styleNonHoveredBorough(featureToUnhover);
			
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

			this.onHoveredBorough(feature); 	

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

	onMobileBoroughSelection(boroughName) {

		this.updateSelectedBorough(boroughName);  

	}

	onMobileDeviceDetected() {

		const { service } = this.props; 

		service.loadLeaflet()

			.then(() => window.console.log("window.L:", window.L)); 

	}

	onNextTurn() {

		const { mobile, showLocationMarker } = this.state; 

		if (showLocationMarker) {

			if (mobile) {

				showLocationMarker.setOpacity(0); 

			} else {

				showLocationMarker.setMap(null); 
			
			}
			
		}

		this.setState({

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
		})

		.then(() => this.showRandomPanorama()); 

	}

	onSelectedBorough(feature) {

		const { choosingLocation } = this.state; 

		if (!(choosingLocation)) return; 

		this.styleUnselectedBoroughs(feature); 
		
		this.styleSelectedBorough(feature);
		
		const boroughName = this.getBoroughName(feature); 

		this.updateSelectedBorough(boroughName);

	}

	onShowingPanorama() {

		const { cityMap, mobile } = this.state; 

		if (mobile) return; 

		cityMap.onShowingPanorama();  

	}

	onSpinnerRevolution() {

		const { spinner } = this.state; 

		spinner.stop(); 

	}

	onTurnComplete() {

		const { blockLevelMap, cityMap, mobile, showLocationMarker } = this.state; 

		const { gameInstance, locationData } = this.props; 

		const promptText = gameInstance.maximumRoundsPlayed() ? this.state.promptText : "Loading next panorama...";

		if (!(mobile)) {

			cityMap.onTurnComplete(); 
		
		} else {

			blockLevelMap.removeLayer(showLocationMarker); 

		}

		cityMap.panTo(locationData.CENTER); 
		cityMap.setZoom(DEFAULT_MAP_ZOOM); 		

		this.setState({
			
			promptText, 
			interchangeHidden: false, 
			selectedBorough: null
		
		}); 

	}

	onWindowResize() {

		const { cityMap } = this.state;

		const { locationData } = this.props; 

		const { CENTER } = locationData; 

		const centerLatLng = new google.maps.LatLng(CENTER.lat, CENTER.lng); 		

		cityMap.setCenter(centerLatLng);

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

	restart() {

		const { gameInstance, store } = this.props; 

		const view = 'map'; 

		store.dispatch({ type: actions.SHOW_MAP });

		gameInstance.emit(events.VIEW_CHANGE, { view }); 		

		return this.setState({  
			selectedBorough: null, 
			promptText: "Starting new game..."
		}); 

	}

	shouldUseDeviceOrientation() {

		const conditions = [

			!!(window.DeviceOrientationEvent) || !!(window.DeviceMotionEvent), 
			window.screen.width < MINIMUM_SPINNER_SCREEN_WIDTH

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
			
					promptText: 'Look closely...which borough is this Street View from?' 
				
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

					this.showSpinner(); 

				}

			}); 		

	}

	showSpinner() {

		const { spinner } = this.state; 

		const { gameInstance } = this.props; 

		spinner.start(); 

		spinner.once('revolution', () => {

			this.onSpinnerRevolution(); 
		
			gameInstance.emit(events.CHOOSING_LOCATION); 

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

		const { cityMap, mobile, selectedBorough } = this.state; 

		if (mobile) return; 

		// On hover, change the fill color of the borough, unless the 
		// borough is the selected borough. 
		if (selectedBorough !== this.getBoroughName(borough)) {

			cityMap.onHoveredBorough(borough, {
				fillColor: HOVERED_BOROUGH_FILL_COLOR
			}); 

		}
	
	}

	styleSelectedBorough(borough) {

		const { cityMap, mobile } = this.state; 

		if (mobile) return; 

		cityMap.onSelectedBorough(borough, {
			fillColor: SELECTED_BOROUGH_FILL_COLOR
		}); 

	}

	styleUnselectedBoroughs(borough) {
			
		const { cityMap, mobile, selectedBorough } = this.state; 

		if (mobile) return; 

		const { locationData } = this.props; 

		const clickedBoroughName = this.getBoroughName(borough); 

		if (selectedBorough === clickedBoroughName) return;  // Don't revert styles if the player clicks on the currently-selected borough  

		const { featureCollection } = locationData; 

		if (!(featureCollection)) return; 

		const unselectedBoroughs = featureCollection.filter(feature => this.getBoroughName(feature) !== clickedBoroughName); 
 
		unselectedBoroughs.forEach(feature => cityMap.unselectBorough(feature)); 

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
	
			<div className={ [ props.gameTwoBlocksClass, this.getDeviceClass() ].join(' ') }>
				<TwoBlocksView 
					blockLevelMap={ state.blockLevelMap }
					boroughLevelMap={ state.boroughLevelMap }
					cityLevelMap={ state.cityMap }
					countdownTimeLeft={ state.countdownTimeLeft }
					interchangeHidden={ state.interchangeHidden }
					mapConfig={ state.mapConfig }
					mapTwoBlocksClass={ props.mapTwoBlocksClass }
					mapMarker={ state.cityMapMarker }
					mapMarkerVisible={ state.mapMarkerVisible }
					mapType={ state.mapType }
					mobile={ state.mobile }
					onMapMounted={ this.onMapMounted.bind(this) }
					onPanoramaMounted={ this.onPanoramaMounted.bind(this) } 
					panorama={ state.panorama } 
					panoramaLatLng={ state.panoramaLatLng } 
					panoramaTwoBlocksClass={ props.panoramaTwoBlocksClass }
					twoBlocksClass={ props.viewTwoBlocksClass }
					view={ store ? store.getState().view : 'map' } 
				/>
				<TwoBlocksInterchange 
					choosingLocation={ state.choosingLocation }
					gameOver={ props.gameInstance && props.gameInstance.gameOver() }
					hidden={ state.interchangeHidden }
					hoveredBorough={ state.hoveredBorough }
					twoBlocksClass={ props.promptTwoBlocksClass }
					promptText={ state.promptText }
					promptTwoBlocksClass={ props.promptTwoBlocksClass }
					evaluateFinalAnswer={ () => this.evaluateFinalAnswer() }
					clearSelectedBorough={ () => this.setState({ selectedBorough: null }) }
					selectedBorough={ state.selectedBorough }
					submitterTwoBlocksClass={ props.submitterTwoBlocksClass }
					hideReplayButton={ !(store) || !(store.getState().gameOver) }
					restart={ () => props.gameInstance.emit(events.RESTART_GAME) }
					replayButtonTwoBlocksClass={ props.replayButtonTwoBlocksClass }
					mobile={ state.mobile }
					onMobileBoroughSelection={ borough => this.onMobileBoroughSelection(borough) }
				/>
			</div>
	
		); 

	}

}

TwoBlocks.propTypes = {
	service 					: React.PropTypes.object.isRequired, 
	store 						: React.PropTypes.object.isRequired, 
	worker 						: React.PropTypes.object, 
	gameInstance 				: React.PropTypes.object.isRequired, 
	locationData 				: React.PropTypes.object.isRequired, 
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
