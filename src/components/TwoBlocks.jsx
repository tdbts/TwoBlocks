/* global document, google, window */

import React from 'react'; 
import TwoBlocksView from './TwoBlocksView';
import TwoBlocksInterchange from './TwoBlocksInterchange'; 
import PromptManager from './component-utils/PromptManager'; 
import createGameComponents from '../game-components/createGameComponents';
import PanoramaMobile from '../game-components/PanoramaMobile';
import PanoramaDesktop from '../game-components/PanoramaDesktop'; 
import { boroughNames, events, gameStages, heardKeys, keyEventMaps, transitionTypes, views, workerMessages, ANSWER_EVALUATION_DELAY, DEFAULT_MAXIMUM_ROUNDS, HOVERED_BOROUGH_FILL_COLOR, KEY_PRESS_DEBOUNCE_TIMEOUT, SELECTED_BOROUGH_FILL_COLOR, WINDOW_RESIZE_DEBOUNCE_TIMEOUT } from '../constants/constants'; 
import { createPromiseTimeout, debounce, isOneOf, isType } from '../utils/utils';  
import actions from '../actions/actions'; 

const promptManager = new PromptManager(); 

class TwoBlocks extends React.Component {

	constructor(props) {

		super(props); 

		// Define initial state 
		this.state = { 

			confirmingAnswer 		: false, 
			guessingLocation 		: false,
			initialized 			: false,  
			interchangeHidden 		: false, 
			mapType 				: 'city',
			countdownTimeLeft 		: null,    
			gameStage 				: null, 
			hoveredBorough 			: null,
			maps 					: null, 
			panorama 				: null,   
			prompt 					: null, 
			promptTransition 		: null, 
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

		const prompt = promptManager.pregame(); 

		this.setState({ 
			maps, 
			// panorama, 
			prompt
		}); 

	}

	componentDidMount() {

		this.addDOMEventListeners(); 
		this.requestGeoJSON(); 

	}

	componentDidUpdate(prevProps, prevState) {  // eslint-disable-line no-unused-vars

		const { selectedBorough } = this.state; 
 
		if (selectedBorough && !(prevState.selectedBorough)) {
			
			this.onDifferentSelectedBorough(); 
		
		}

		const { service } = this.props;

		service.librariesAreLoaded()

			.then(() => this.initializeTwoBlocks());			

	}

	/*----------  Custom Component Methods  ----------*/
	
	addCityMapEventListeners(mapInstance) {

		const { mobile } = this.props;

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

		if (this.props.mobile) {

			// Prevent drags from moving the game view layers 
			window.addEventListener('touchmove', onTouchMove); 

		} 

	}

	addGameEventListeners(twoBlocks) {

		twoBlocks.on(events.GAME_STAGE, stages => this.onGameStage(stages)); 

		twoBlocks.once(events.GAME_COMPONENTS, gameComponents => this.onGameComponents(gameComponents)); 		

		twoBlocks.on(events.NEXT_TURN, () => this.onNextTurn()); 

		twoBlocks.on(events.NEW_PANORAMA, panoramaDetails => this.onNewPanorama(panoramaDetails)); 

		twoBlocks.on(events.SHOWING_PANORAMA, () => this.onShowingPanorama()); 

		twoBlocks.on(events.GUESSING_LOCATION, () => this.onGuessingLocation()); 

		twoBlocks.on(events.ANSWER_EVALUATED, answerDetails => this.onAnswerEvaluated(answerDetails)); 

		twoBlocks.on(events.CORRECT_BOROUGH, boroughName => this.onCorrectBorough(boroughName)); 

		twoBlocks.on(events.INCORRECT_BOROUGH, selectionDetails => this.onIncorrectBorough(selectionDetails)); 

		twoBlocks.on(events.TURN_COMPLETE, () => this.onTurnComplete()); 

		twoBlocks.on(events.GAME_OVER, () => this.onGameOver()); 

		twoBlocks.on(events.RESTART_GAME, () => this.restart()); 

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

		return this.props.mobile ? [ 'mobile' ].join(' ').trim() : ''; 

	}

	getFeatureByBoroughName(boroughName) {

		if (!(boroughName) || !(isType('string', boroughName))) return; 

		const { featureCollection } = this.props.locationData; 

		const feature = featureCollection.filter(feature => boroughName === this.getBoroughName(feature))[0]; 

		return feature; 

	}

	getGameClassList() {

		return [ this.props.TWO_BLOCKS_CLASS, this.getDeviceClass() ].join(' ').trim(); 

	}

	getTurnCompletionPrompt() {

		const { gameInstance } = this.props; 

		return gameInstance.maximumRoundsPlayed() 
			
			? this.state.prompt 
			: promptManager.loadingPanorama();

	}

	initializeTwoBlocks() {

		if (this.state.initialized) return;  // Game already initialized 

		const { maps } = this.state;  

		const { gameInstance, locationData, mobile, store } = this.props; 

		if (!(this.requiredDOMElementsExist())) return;  // DOM elements must exist before the game instance can be initialized 

		/*----------  Create Game Components  ----------*/
						
		const gameComponents = createGameComponents({
			locationData, 
			maps,  
			mobile 
		}); 

		window.console.log("gameComponents:", gameComponents); 

		/*----------  Start Game Instance  ----------*/
		
		this.addGameEventListeners(gameInstance); 

		gameInstance.start(); 
		
		/*----------  Show Map  ----------*/
		
		const view = views.MAP; 

		store.dispatch({ type: actions.SHOW_MAP });

		gameInstance.emit(events.VIEW_CHANGE, { view }); 		

		/*----------  Update State  ----------*/
		
		const nextState = {
			...gameComponents,  
			initialized: true, 
			promptTransition: transitionTypes.SHOWING
		}; 

		return this.setState(nextState)

			.then(() => this.addCityMapEventListeners(this.state.maps.city.instance))

			.then(() => gameInstance.emit(events.GAME_COMPONENTS, gameComponents))

			.then(() => {

				if (this.props.mobile) {

					gameInstance.emit(events.VIEW_COMPLETE, gameStages.PREGAME); 

				}

			}); 	

	}

	onAnswerEvaluated(answerDetails) {

		const { lat, lng } = answerDetails.randomLatLng; 

		const { maps, showLocationMarker } = this.state; 

		const { mobile, store } = this.props;

		showLocationMarker.setLocation(lat, lng); 
		showLocationMarker.placeOnMap(maps.borough.instance); 

		store.dispatch({
			type: actions.SHOW_MAP
		});

		return Promise.resolve()

			.then(() => {

				if (!(this.props.mobile)) return; 

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

			.then(() => this.setState({ 
			
				mapType: 'block' 
			
			}))

			.then(() => {

				const { gameInstance } = this.props; 

				gameInstance.emit(events.VIEW_COMPLETE, gameStages.EVALUATING_ANSWER); 

			});

	}

	onButtonClick(type) {

		const { gameInstance, store } = this.props; 

		if ('BOROUGH_SUBMISSION' === type) {

			this.submitFinalAnswer(); 

		} else if ('GO_BACK' === type) {

			store.dispatch({
				type: actions.CLEAR_SELECTED_BOROUGH
			}); 			

			this.setState({ 
				confirmingAnswer: false, 
				selectedBorough: null 
			}); 

		} else if ('RESTART' === type) {

			gameInstance.emit(events.RESTART_GAME); 

		} else if (isOneOf(boroughNames, type)) {

			this.onMobileBoroughSelection(type); 

		}

	}

	onGuessingLocation() {

		const { maps, panorama } = this.state; 

		const { mobile } = this.props;

		if (!(mobile)) {

			maps.city.instance.onGuessingLocation(); 
		
		}

		panorama.setOptions({
			motionTracking: false, 
			motionTrackingControl: false
		});		

		return this.setState({
			guessingLocation: true, 
			hoveredBorough: '', 
			interchangeHidden: false,  
			prompt: promptManager.guessingLocation(), 
			promptTransition: null
		})

		.then(() => maps.city.element.blur())

		.then(() => createPromiseTimeout(1))

		.then(() => this.setState({
			promptTransition: transitionTypes.SHOWING
		}))

		.then(() => createPromiseTimeout(1000));

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

	onDifferentSelectedBorough() {

		return Promise.resolve()

			.then(() => {

				if (this.props.mobile) {

					return createPromiseTimeout(1500);

				}

			})

			.then(() => this.setState({
				
				confirmingAnswer: true
			
			})); 

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
		})

		.then(() => gameInstance.emit(events.VIEW_COMPLETE, gameStages.POSTGAME)); 

	}

	onGameStage(stages) {

		const { stage } = stages; 

		if (gameStages.LOADING_PANORAMA === stage) {

			const { gameInstance } = this.props;

			gameInstance.emit(events.VIEW_COMPLETE, stage);  

		} else if (gameStages.EVALUATING_ANSWER === stage) {

			this.setState({
				confirmingAnswer: false
			}); 

		}			

	}

	onGeoJSONReceived(geoJSON) {

		const { maps } = this.state; 

		const { gameInstance, locationData, mobile } = this.props;  

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

		gameInstance.emit(events.VIEW_COMPLETE, gameStages.PREGAME); 

	}

	onIncorrectBorough(selectionDetails) {

		const { correctBorough, selectedBorough } = selectionDetails; 

		this.setState({
			prompt: promptManager.incorrectBorough(selectedBorough, correctBorough)
		}); 

	}

	onKeydown(e) {

		e.preventDefault();  // Prevent arrows from scrolling page 

		const { hoveredBorough, selectedBorough } = this.state;

		const { mobile } = this.props;

		if (mobile) return;  // Keypresses only apply to desktop 

		const { gameInstance, store } = this.props; 

		const { view } = store.getState(); 

		const { gameStage } = store.getState(); 

		if (gameStages.PREGAME === gameStage) return;  // (For now) keypresses do not have any effect in the 'pregame' stage.  

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

				this.submitFinalAnswer(); 

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

	onNewPanorama() {

		const { maps, panorama } = this.state; 
		
		const { store } = this.props; 

		const { boroughName, randomLatLng } = store.getState().currentTurn; 
		panorama.setBorough(boroughName);
		panorama.setPosition(randomLatLng);

		maps.block.instance.panTo(randomLatLng); 
		maps.borough.instance.panTo(randomLatLng); 

		return createPromiseTimeout(1000)

		.then(() => this.setState({
			promptTransition: transitionTypes.LEAVING
		}))

		.then(() => createPromiseTimeout(1000))

		.then(() => this.setState({
			promptTransition: null
		})) 

		.then(() => this.showPanorama()); 

	}

	onNextTurn() {

		const { showLocationMarker } = this.state; 
		
		showLocationMarker.hide();

		this.setState({

			mapType: 'city'
		
		});

	}

	onPanoramaMounted(element) {

		const { gameInstance, mobile } = this.props;

		const options = { 
			fullscreenControl: false, 
			position: null, 
			visible: true, 
			zoomControl: false
		};

		const panorama = mobile ? new PanoramaMobile(element, options) : new PanoramaDesktop(element, options);

		panorama.on(panorama.events.DISPLAY_STOP, () => gameInstance.emit(events.VIEW_COMPLETE, gameStages.SHOWING_PANORAMA));

		if (mobile) {

			panorama.on(panorama.events.COUNTDOWN_START, countdownTimeLeft => this.setState({ countdownTimeLeft }));

			panorama.on(panorama.events.COUNTDOWN_TICK, countdownTimeLeft => this.setState({ countdownTimeLeft }));

		} else {

			panorama.on(panorama.events.DISPLAY_STOP, () => {
	
				const { store } = this.props;

				const view = views.MAP;

				store.dispatch({ type: actions.SHOW_MAP });

				gameInstance.emit(events.VIEW_CHANGE, { view }); 	

			});

		}

		this.setState({ panorama });

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

		const { maps } = this.state; 

		const { mobile } = this.props;

		if (mobile) return; 

		maps.city.instance.onShowingPanorama();  

	}

	onTurnComplete() {

		const { maps, showLocationMarker } = this.state; 

		const { gameInstance, locationData, mobile, store } = this.props; 

		const prompt = this.getTurnCompletionPrompt(); 

		if (!(mobile)) {

			maps.city.instance.onTurnComplete(); 
		
		} else {

			maps.block.instance.removeLayer(showLocationMarker.marker); 

		}

		const centerLatLng = new google.maps.LatLng(locationData.CENTER.lat, locationData.CENTER.lng); 		

		// Re-center map in case player moved it 
		maps.city.instance.setCenter(centerLatLng);

		store.dispatch({
			type: actions.CLEAR_SELECTED_BOROUGH
		}); 		

		return this.setState({
			
			prompt,
			interchangeHidden: false, 
			promptTransition: null,  
			selectedBorough: null
		
		})

		.then(() => createPromiseTimeout(1))

		.then(() => this.setState({
			promptTransition: transitionTypes.SHOWING
		}))

		.then(() => gameInstance.emit(events.VIEW_COMPLETE, gameStages.LOADING_PANORAMA)); 

	}

	onWindowResize() {

		const { maps } = this.state;

		const { locationData } = this.props; 

		const { CENTER } = locationData; 

		const centerLatLng = new google.maps.LatLng(CENTER.lat, CENTER.lng); 		

		maps.city.instance.setCenter(centerLatLng);

	}

	// If on desktop, request the GeoJSON data from the web worker in order to 
	// show the borough boundaries on the map.  Add a listener to handle the 
	// data once the worker has sent it, and then make the request for the data.  
	// If there is no worker, move on using the GeoJSON member of th game instance.  
	requestGeoJSON() {

		const { mobile } = this.props;

		if (mobile) return;  // Request GeoJSON only on desktop (for map)

		const { gameInstance, worker } = this.props; 

		return gameInstance.geoJSONLoaded() 

			.then(() => {

				if (worker) {

					this.requestGeoJSONFromWorker(); 

				} else {

					this.onGeoJSONReceived(gameInstance.locationData.featureCollection); 

				}

			}); 	

	}

	requestGeoJSONFromWorker() {

		const { worker } = this.props; 

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

	} 

	// Child <TwoBlocksMap /> and <TwoBlocksPanorama /> 
	// components will call methods which update this 
	// component's state with the child components' 
	// respective DOM elements.   
	requiredDOMElementsExist() {

		const { maps, panorama } = this.state; 

		if (!(maps) || !(panorama)) return;

		return maps.block.element && maps.borough.element && maps.city.element && panorama.el(); 		

	}

	restart() {

		const { gameInstance, store } = this.props; 

		const view = views.MAP; 

		store.dispatch({ type: actions.SHOW_MAP });

		gameInstance.emit(events.VIEW_CHANGE, { view }); 	

		store.dispatch({
			type: actions.CLEAR_SELECTED_BOROUGH
		}); 

		return this.setState({  
			selectedBorough: null, 
			prompt: promptManager.restart()
		}); 

	}

	showPanorama() {
	
		const { panorama } = this.state;
		const { gameInstance, store } = this.props; 

		const view = views.PANORAMA; 

		panorama.setOptions({
			motionTracking: true, 
			motionControl: true
		});		

		store.dispatch({ 
			type: actions.SHOW_PANORAMA
		}); 

		gameInstance.emit(events.SHOWING_PANORAMA); 
		gameInstance.emit(events.VIEW_CHANGE, { view }); 

		const prompt = promptManager.showingPanorama(); 
		const promptTransition = transitionTypes.SHOWING; 

		return this.setState({ prompt })

			.then(() => this.props.mobile ? createPromiseTimeout(1) : null)

			.then(() => this.setState({ promptTransition }))

			.then(() => this.props.mobile ? createPromiseTimeout(2500) : null)

			.then(() => this.setState({
				promptTransition: transitionTypes.LEAVING
			}))

			.then(() => createPromiseTimeout(1000))

			.then(() => {

				this.state.panorama.display();

				this.setState({
					interchangeHidden: this.props.mobile
				}); 

			}); 		

	}

	styleHoveredBorough(borough) {

		const { maps, selectedBorough } = this.state; 

		const { mobile } = this.props;

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

		const { maps, selectedBorough } = this.state;

		const { mobile } = this.props;

		if (mobile) return; 

		if (selectedBorough !== this.getBoroughName(borough)) {

			maps.city.instance.unselectBorough(borough); 

		}

	}

	styleSelectedBorough(borough) {

		const { maps } = this.state; 

		const { mobile } = this.props;

		if (mobile) return; 

		maps.city.instance.onSelectedBorough(borough, {
			fillColor: SELECTED_BOROUGH_FILL_COLOR
		}); 

	}

	styleUnselectedBoroughs(borough) {
			
		const { maps, selectedBorough } = this.state; 

		const { mobile } = this.props;

		if (mobile) return; 

		const { locationData } = this.props; 

		const clickedBoroughName = this.getBoroughName(borough); 

		if (selectedBorough === clickedBoroughName) return;  // Don't revert styles if the player clicks on the currently-selected borough  

		const { featureCollection } = locationData; 

		if (!(featureCollection)) return; 

		const unselectedBoroughs = featureCollection.filter(feature => this.getBoroughName(feature) !== clickedBoroughName); 
 
		unselectedBoroughs.forEach(feature => maps.city.instance.unselectBorough(feature)); 

	}

	submitFinalAnswer() {
		
		if (!(this.state.guessingLocation)) return; 

		const { gameInstance } = this.props; 

		gameInstance.emit(events.VIEW_COMPLETE, gameStages.GUESSING_LOCATION); 

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

		const { selectedBorough } = this.state; 

		const { store } = this.props; 

		if (selectedBorough === boroughName) return; 

		store.dispatch({
			type: actions.BOROUGH_SELECTED, 
			selectedBorough: boroughName
		}); 		

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
	
			<div className={ this.getGameClassList() }>
				<TwoBlocksView 
					countdownTimeLeft={ state.countdownTimeLeft }
					interchangeHidden={ state.interchangeHidden }
					maps={ state.maps }
					mapType={ state.mapType }
					mobile={ props.mobile }
					onMapMounted={ this.onMapMounted.bind(this) }
					onPanoramaMounted={ this.onPanoramaMounted.bind(this) }  
					panorama={ state.panorama }
					view={ store ? store.getState().view : 'map' } 
				/>
				<TwoBlocksInterchange 
					confirmingAnswer={ state.confirmingAnswer }
					guessingLocation={ state.guessingLocation }
					gameOver={ props.gameInstance && props.gameInstance.gameOver() }
					gameStage={ store.getState().gameStage }
					hidden={ state.interchangeHidden }
					hideReplayButton={ !(store) || !(store.getState().gameOver) }
					hoveredBorough={ state.hoveredBorough }
					mobile={ props.mobile }
					onButtonClick={ this.onButtonClick.bind(this) }
					prompt={ state.prompt }
					promptTransition={ state.promptTransition }
					selectedBorough={ state.selectedBorough }
					twoBlocksClass={ props.promptTwoBlocksClass }
				/>
			</div>
	
		); 

	}

}

TwoBlocks.propTypes = {
	TWO_BLOCKS_CLASS 			: React.PropTypes.string.isRequired, 
	mobile  					: React.PropTypes.bool.isRequired,	
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
