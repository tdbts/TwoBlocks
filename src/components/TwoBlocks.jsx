/* global document, window */

import React from 'react'; 
import TwoBlocksView from './TwoBlocksView';
import TwoBlocksInterchange from './TwoBlocksInterchange'; 
import PromptManager from './component-utils/PromptManager'; 
import CityMapsDesktop from '../game-components/CityMapsDesktop';
import CityMapsMobile from '../game-components/CityMapsMobile';
import ShowLocationMarker from '../game-components/ShowLocationMarker';
import PanoramaMobile from '../game-components/PanoramaMobile';
import PanoramaDesktop from '../game-components/PanoramaDesktop';
import twoBlocksUtils from '../game-utils/twoBlocksUtils';
import twoBlocks from '../reducers/twoBlocks';
import TwoBlocksWorker from '../workers/twoBlocks.worker.js';
import TwoBlocksService from '../services/TwoBlocksService'; 
import Gameplay from '../game-components/Gameplay';  
import { boroughNames, events, gameStages, heardKeys, keyEventMaps, nycCoordinates, transitionTypes, views, workerMessages, ANSWER_EVALUATION_DELAY, KEY_PRESS_DEBOUNCE_TIMEOUT, WINDOW_RESIZE_DEBOUNCE_TIMEOUT } from '../constants/constants'; 
import { createPromiseTimeout, debounce, isOneOf, isType } from '../utils/utils';  
import actions from '../actions/actions'; 
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore } from 'redux';

const promptManager = new PromptManager(); 

class TwoBlocks extends React.Component {

	constructor(props) {

		super(props); 

		this.locationData = nycCoordinates;

		this.gameplay = null;
		this.mobile = null;  // Should live in state 
		this.service = null;
		this.store = null;
		this.worker = null;

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
			mapElements 			: {},
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

		/*----------  Load CSS  ----------*/
		
		twoBlocksUtils.loadCSS();

		/*----------  Create Redux Store  ----------*/

		const reducers = [ twoBlocks ]; 

		if ('development' === process.env.NODE_ENV) {

			reducers.push(composeWithDevTools()); 

		}

		this.store = createStore(...reducers); 

		/*----------  Create TwoBlocks WebWorker  ----------*/

		this.worker = window.Worker ? new TwoBlocksWorker() : null;

		if (this.worker) {

			this.worker.onmessage = e => window.console.log("Worker message:", e.data); 

			this.worker.addEventListener('error', e => window.console.log("Worker error:", e)); 

		}


		/*----------  Create service for data requests  ----------*/

		this.service = new TwoBlocksService(this.worker); 

		window.console.log("this.service:", this.service); 

		/*----------  Create TwoBlocks Game Instance  ----------*/

		this.gameplay = new Gameplay(this.store, this.worker, this.service); 

		window.console.log("this.gameplay:", this.gameplay); 

		/*----------  Start Loading the GeoGson Immediately  ----------*/

		const { GEO_JSON_SOURCE } = this.locationData; 

		this.service.loadCityLocationData(GEO_JSON_SOURCE)  // The GeoJSON is heavy.  Start loading it as soon as possible 

			.then(response => {

				const payload = response ? response.body : null; 

				// When a Web Worker is available, the GeoJSON object stays on the worker 
				// thread, and the game instance requests data as needed.  Without 
				// a worker, however, this is not the case.  Here, once the GeoJSON has been 
				// loaded, inform the game instance and pass the JSON to it for reference.
				this.gameplay.emit(events.GEO_JSON_LOADED, payload); 

			})

			.catch(e => window.console.error(e)); 

		/*----------  Start Loading Leaflet Library  ----------*/

		this.mobile = twoBlocksUtils.shouldUseDeviceOrientation();

		if (this.mobile) {

			this.service.loadLeaflet()

				.then(() => window.console.log("window.L:", window.L)); 

		}

		/*----------  Add Google Maps Script  ----------*/

		this.service.loadGoogleMaps(process.env.MAPS_API_KEY); 		

		/*----------  Load Pregame Prompt  ----------*/
		
		const prompt = promptManager.pregame(); 

		this.setState({  
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

	}

	/*----------  Custom Component Methods  ----------*/

	addDOMEventListeners() {

		/*----------  Resize map on window 'resize' events  ----------*/

		const onWindowResize = debounce(this.onWindowResize.bind(this), WINDOW_RESIZE_DEBOUNCE_TIMEOUT); 

		/*----------  Handle key presses  ----------*/
		
		const onKeydown = debounce(this.onKeydown.bind(this), KEY_PRESS_DEBOUNCE_TIMEOUT); 

		window.addEventListener('resize', onWindowResize); 

		window.addEventListener('keydown', onKeydown);
		
		/*----------  Handle touchmove events  ----------*/
		
		const onTouchMove = e => e.preventDefault(); 

		if (this.mobile) {

			// Prevent drags from moving the game view layers 
			window.addEventListener('touchmove', onTouchMove); 

		} 

	}

	addGameEventListeners(twoBlocks) {

		twoBlocks.on(events.GAME_STAGE, stages => this.onGameStage(stages)); 

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
	
	addMapsEventListeners(maps) {

		if (!(maps) || this.mobile) return;  // Event listeners below only apply to desktop game instances  
 
		maps.on('mouseover', event => this.onMapMouseover(event));

		maps.on('mouseout', event => this.onMapMouseout(event)); 	

		maps.on('click', event => this.onMapClick(event));  

	}

	createMaps(elements) {

		return this.service.librariesAreLoaded()

			.then(() => {

				if (this.state.maps) return;

				const { lat, lng } = this.locationData.CENTER;

				const MapsClass = this.mobile ? CityMapsMobile : CityMapsDesktop;

				const maps = new MapsClass(elements);

				maps.setCenter(lat, lng);

				this.setState({ maps });

				return maps;
			
			});

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

		return this.mobile ? [ 'mobile' ].join(' ').trim() : ''; 

	}

	getFeatureByBoroughName(boroughName) {

		if (!(boroughName) || !(isType('string', boroughName))) return; 

		const { featureCollection } = this.locationData; 

		const feature = featureCollection.filter(feature => boroughName === this.getBoroughName(feature))[0]; 

		return feature; 

	}

	getGameClassList() {

		return [ "two-blocks", this.getDeviceClass() ].join(' ').trim(); 

	}

	getTurnCompletionPrompt() {

		return this.gameplay.maximumRoundsPlayed() 
			
			? this.state.prompt 
			: promptManager.loadingPanorama();

	}

	initializeTwoBlocks() {

		if (this.state.initialized) return;  // Game already initialized 

		const { maps } = this.state;  

		// DOM elements must exist before the game instance can be initialized 
		if (!(this.requiredGameComponentsExist())) return;  

		/*----------  Start Game Instance  ----------*/
		
		this.addGameEventListeners(this.gameplay); 

		this.gameplay.start(); 
		
		/*----------  Show Map  ----------*/
		
		const view = views.MAP; 

		this.store.dispatch({ type: actions.SHOW_MAP });

		this.gameplay.emit(events.VIEW_CHANGE, { view }); 		

		/*----------  Update State  ----------*/
		
		const nextState = {
			initialized: true, 
			promptTransition: transitionTypes.SHOWING
		}; 

		return this.setState(nextState)

			.then(() => this.addMapsEventListeners(maps))

			.then(() => this.gameplay.emit(events.INIT))

			.then(() => {

				if (this.mobile) {

					this.gameplay.emit(events.VIEW_COMPLETE, gameStages.PREGAME); 

				}

			}); 	

	}

	onAnswerEvaluated(answerDetails) {

		const { lat, lng } = answerDetails.randomLatLng; 

		const { maps, showLocationMarker } = this.state; 

		showLocationMarker.setLocation(lat, lng); 
		showLocationMarker.placeOnBoroughLevelMap();

		this.store.dispatch({
			type: actions.SHOW_MAP
		});

		return Promise.resolve()

			.then(() => {

				if (!(this.mobile)) return; 
				
				maps.onAnswerEvaluated(lat, lng);

				return createPromiseTimeout(1500);  // Communicate result of answer evaluation 

			})

			.then(() => this.setState({

				interchangeHidden: this.mobile, 
				guessingLocation: false, 
				mapType: 'borough'

			})) 

			.then(() => createPromiseTimeout(ANSWER_EVALUATION_DELAY / 2))

			.then(() => {

				if (this.mobile) {
					
					maps.getBoroughLevelMap().removeLayer(showLocationMarker.getMarker());
					
				} 

				showLocationMarker.placeOnBlockLevelMap(); 

			})

			.then(() => this.setState({ 
			
				mapType: 'block' 
			
			}))

			.then(() => this.gameplay.emit(events.VIEW_COMPLETE, gameStages.EVALUATING_ANSWER));

	}

	onButtonClick(type) {

		if ('BOROUGH_SUBMISSION' === type) {

			this.submitFinalAnswer(); 

		} else if ('GO_BACK' === type) {

			this.store.dispatch({
				type: actions.CLEAR_SELECTED_BOROUGH
			}); 			

			this.setState({ 
				confirmingAnswer: false, 
				selectedBorough: null 
			}); 

		} else if ('RESTART' === type) {

			this.gameplay.emit(events.RESTART_GAME); 

		} else if (isOneOf(boroughNames, type)) {

			this.onMobileBoroughSelection(type); 

		}

	}

	onGuessingLocation() {

		const { maps, panorama } = this.state; 

		const { randomLatLng } = this.store.getState().currentTurn; 
		
		maps.onGuessingLocation(randomLatLng); 
		
		panorama.onGuessingLocation();

		return this.setState({
			guessingLocation: true, 
			hoveredBorough: '', 
			interchangeHidden: false,  
			prompt: promptManager.guessingLocation(), 
			promptTransition: null
		})

		.then(() => createPromiseTimeout(1))

		.then(() => this.setState({
			promptTransition: transitionTypes.SHOWING
		}))

		.then(() => createPromiseTimeout(1000));

	}

	onMapClick(event) {

		const { maps } = this.state;

		if (maps.mapTypes.CITY !== event.mapType) return;

		if (this.gameplay.gameOver()) return; 

		this.onSelectedBorough(event.feature);  
	
	}

	onMapMouseout(event) {

		const { guessingLocation, gameOver, maps } = this.state; 

		if (maps.mapTypes.CITY !== event.mapType) return;
					
		this.updateHoveredBorough('');

		this.styleNonHoveredBorough(event.feature); 

		if (!(gameOver) && guessingLocation) {

			this.setState({

				prompt: promptManager.guessingLocation() 

			}); 

		}

	}

	onMapMouseover(event) {

		const { maps } = this.state;

		if (maps.mapTypes.CITY !== event.mapType) return;

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

				if (this.mobile) {

					return createPromiseTimeout(1500);

				}

			})

			.then(() => this.setState({
				
				confirmingAnswer: true
			
			})); 

	}

	onGameComponents(/* gameComponents */) {

	}

	onGameOver() {

		window.console.log("GAME OVER."); 

		const { showLocationMarker } = this.state; 
 
		showLocationMarker.hide(); 

		return this.setState({
			mapType: 'city',
			prompt: promptManager.gameOver(this.gameplay.totalCorrectAnswers(), this.gameplay.getMaximumRounds()) 
		})

		.then(() => this.gameplay.emit(events.VIEW_COMPLETE, gameStages.POSTGAME)); 

	}

	onGameStage(stages) {

		const { stage } = stages; 

		if (gameStages.LOADING_PANORAMA === stage) {

			this.gameplay.emit(events.VIEW_COMPLETE, stage);  

		} else if (gameStages.EVALUATING_ANSWER === stage) {

			this.setState({
				confirmingAnswer: false
			}); 

		}			

	}

	onGeoJSONReceived(geoJSON) {

		const { maps } = this.state; 

		// Race condition circumvention: If the cityMap does not 
		// yet exist, wait until the 'INIT' event fires to execute 
		// the rest of the method body.  
		if (!(maps)) {
			
			this.gameplay.once(events.INIT, () => this.onGeoJSONReceived(geoJSON)); 

			return; 

		} 

		if (!(this.mobile)) {

			// Add GeoJSON to the cityMap if not on mobile.  The 'addGeoJson()' method 
			// returns the feature collection.  Each borough is a feature.
			const featureCollection = maps.onGeoJSONReceived(geoJSON);  

			this.locationData.featureCollection = featureCollection; 

		}

		this.gameplay.emit(events.VIEW_COMPLETE, gameStages.PREGAME); 

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

		if (this.mobile) return;  // Keypresses only apply to desktop 

		const { view } = this.store.getState(); 

		const { gameStage } = this.store.getState(); 

		if (gameStages.PREGAME === gameStage) return;  // (For now) keypresses do not have any effect in the 'pregame' stage.  

		const { arrowKeyHoverMap, firstArrowKeyPressBoroughMap } = keyEventMaps; 

		if (!(isOneOf(heardKeys, e.key))) return;  // Only react to key presses we're listening for. 

		if ('map' !== view) return;  // Don't react to key presses if the map is not showing (for now). 

		if ('Enter' === e.key) {

			if (this.gameplay.gameOver()) {

				this.gameplay.emit(events.RESTART_GAME); 

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

	onMapMounted(mapType, mapElement) {

		const { mapElements } = this.state;

		mapElements[mapType] = mapElement;

		const newState = {
			mapElements
		}; 

		return this.setState(newState)

			.then(() => {

				const { maps } = this.state;

				if (maps || !(mapElements.city) || !(mapElements.borough) || !(mapElements.block)) return;

				return this.createMaps(mapElements);

			})

			.then(() => {

				const { maps } = this.state;

				const showLocationMarker = new ShowLocationMarker(maps, this.mobile);

				return this.setState({ showLocationMarker });

			})

			.then(() => this.initializeTwoBlocks()); 

	}

	onMobileBoroughSelection(boroughName) {

		this.updateSelectedBorough(boroughName);  

	}

	onNewPanorama() {

		const { panorama } = this.state; 

		const { boroughName, randomLatLng } = this.store.getState().currentTurn; 

		panorama.setBorough(boroughName);
		panorama.setPosition(randomLatLng);

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

		if (this.state.panorama) return;

		this.service.librariesAreLoaded()

			.then(() => {

				const options = { 
					fullscreenControl: false, 
					position: null, 
					visible: true, 
					zoomControl: false
				};

				const panorama = this.mobile ? new PanoramaMobile(element, options) : new PanoramaDesktop(element, options);

				panorama.on(panorama.events.DISPLAY_STOP, () => this.gameplay.emit(events.VIEW_COMPLETE, gameStages.SHOWING_PANORAMA));

				if (this.mobile) {

					panorama.on(panorama.events.COUNTDOWN_START, countdownTimeLeft => this.setState({ countdownTimeLeft }));

					panorama.on(panorama.events.COUNTDOWN_TICK, countdownTimeLeft => this.setState({ countdownTimeLeft }));

				} else {

					panorama.on(panorama.events.DISPLAY_STOP, () => {
			
						const view = views.MAP;

						this.store.dispatch({ type: actions.SHOW_MAP });

						this.gameplay.emit(events.VIEW_CHANGE, { view }); 	

					});

				}

				this.setState({ panorama });
			
			});

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

		maps.onShowingPanorama();

	}

	onTurnComplete() {

		const { maps, showLocationMarker } = this.state; 

		const prompt = this.getTurnCompletionPrompt(); 

		maps.onTurnComplete();

		if (this.mobile) {

			maps.getBlockLevelMap().removeLayer(showLocationMarker.getMarker());

		}

		// Re-center map in case player moved it 
		maps.setCenter(this.locationData.CENTER.lat, this.locationData.CENTER.lng);

		this.store.dispatch({
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

		.then(() => this.gameplay.emit(events.VIEW_COMPLETE, gameStages.LOADING_PANORAMA)); 

	}

	onWindowResize() {

		const { maps } = this.state;

		if (!(maps)) return;

		const { CENTER } = this.locationData; 

		maps.setCenter(CENTER.lat, CENTER.lng);

	}

	// If on desktop, request the GeoJSON data from the web worker in order to 
	// show the borough boundaries on the map.  Add a listener to handle the 
	// data once the worker has sent it, and then make the request for the data.  
	// If there is no worker, move on using the GeoJSON member of th game instance.  
	requestGeoJSON() {

		if (this.mobile) return;  // Request GeoJSON only on desktop (for map)

		return this.gameplay.geoJSONLoaded() 

			.then(() => {

				if (this.worker) {

					this.requestGeoJSONFromWorker(); 

				} else {

					this.onGeoJSONReceived(this.locationData.featureCollection); 

				}

			}); 	

	}

	requestGeoJSONFromWorker() {

		/*----------  onGeoJSONSent()  ----------*/

		const onGeoJSONSent = event => {

			const { message, payload } = event.data; 

			if (workerMessages.SENDING_GEO_JSON !== message) return; 
 
			this.onGeoJSONReceived(payload);  

			this.worker.removeEventListener('message', onGeoJSONSent); 

		}; 

		// Assign the event listener before posting message 
		this.worker.addEventListener('message', onGeoJSONSent); 

		// Request GeoJSON from web worker 
		this.worker.postMessage({

			message: workerMessages.REQUEST_GEO_JSON

		}); 

	} 

	// Child <TwoBlocksMap /> and <TwoBlocksPanorama /> 
	// components will call methods which update this 
	// component's state with the child components' 
	// respective DOM elements, which in turn allows 
	// the 'maps' and 'panorama' class instances to 
	// be created.   
	requiredGameComponentsExist() {

		const { maps, panorama } = this.state; 
 		
		return !!maps && !!panorama;

	}

	restart() {

		const view = views.MAP; 

		this.store.dispatch({ type: actions.SHOW_MAP });

		this.gameplay.emit(events.VIEW_CHANGE, { view }); 	

		this.store.dispatch({
			type: actions.CLEAR_SELECTED_BOROUGH
		}); 

		return this.setState({  
			selectedBorough: null, 
			prompt: promptManager.restart()
		}); 

	}

	showPanorama() {
	
		const { panorama } = this.state;

		const view = views.PANORAMA; 

		panorama.setOptions({
			motionTracking: true, 
			motionControl: true
		});		

		this.store.dispatch({ 
			type: actions.SHOW_PANORAMA
		}); 

		this.gameplay.emit(events.SHOWING_PANORAMA); 
		this.gameplay.emit(events.VIEW_CHANGE, { view }); 

		const prompt = promptManager.showingPanorama(); 
		const promptTransition = transitionTypes.SHOWING; 

		return this.setState({ prompt })

			.then(() => this.mobile ? createPromiseTimeout(1) : null)

			.then(() => this.setState({ promptTransition }))

			.then(() => this.mobile ? createPromiseTimeout(2500) : null)

			.then(() => this.setState({
				promptTransition: transitionTypes.LEAVING
			}))

			.then(() => createPromiseTimeout(1000))

			.then(() => {

				this.state.panorama.display();

				this.setState({
					interchangeHidden: this.mobile
				}); 

			}); 		

	}

	styleHoveredBorough(borough) {

		const { maps, selectedBorough } = this.state; 

		if (this.mobile) return; 

		// On hover, change the fill color of the borough, unless the 
		// borough is the selected borough. 
		if (selectedBorough !== this.getBoroughName(borough)) {

			maps.onConsideredBorough(borough); 

		}
	
	}

	styleNonHoveredBorough(borough) {

		if (!(borough)) return; 

		const { maps, selectedBorough } = this.state;

		if (this.mobile) return; 

		if (selectedBorough !== this.getBoroughName(borough)) {

			maps.unselectBorough(borough);

		}

	}

	styleSelectedBorough(borough) {

		const { maps } = this.state; 

		if (this.mobile) return; 

		maps.onSelectedBorough(borough); 

	}

	styleUnselectedBoroughs(borough) {
			
		const { maps, selectedBorough } = this.state; 

		if (this.mobile) return; 

		const clickedBoroughName = this.getBoroughName(borough); 

		// Don't revert styles if the player clicks on the currently-selected borough  
		if (selectedBorough === clickedBoroughName) return;  

		const { featureCollection } = this.locationData; 

		if (!(featureCollection)) return; 

		const unselectedBoroughs = featureCollection.filter(feature => this.getBoroughName(feature) !== clickedBoroughName); 
  
		unselectedBoroughs.forEach(feature => maps.unselectBorough(feature)); 		

	}

	submitFinalAnswer() {
		
		if (!(this.state.guessingLocation)) return; 

		this.gameplay.emit(events.VIEW_COMPLETE, gameStages.GUESSING_LOCATION); 

	}

	updateHoveredBorough(feature) {

		if (!(feature)) {  // No borough is currently hovered.  Modify state to reflect this. 

			return this.setState({
				hoveredBorough: ''
			}); 

		}

		const boroughName = this.getBoroughName(feature); 

		// Don't change state if the hovered borough has not changed. 
		if (this.state.hoveredBorough === boroughName) return;  

		return this.setState({
			hoveredBorough: boroughName
		}); 

	}

	updateSelectedBorough(boroughName) {

		const { selectedBorough } = this.state; 

		if (selectedBorough === boroughName) return; 

		this.store.dispatch({
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
		const { store } = this; 
 
		return (
	
			<div className={ this.getGameClassList() }>
				<TwoBlocksView 
					blockLevelMap={ state.maps && state.maps.getBlockLevelMap() }
					boroughLevelMap={ state.maps && state.maps.getBoroughLevelMap() }
					cityLevelMap={ state.maps && state.maps.getCityLevelMap() }
					countdownTimeLeft={ state.countdownTimeLeft }
					maps={ state.maps }
					mapType={ state.mapType }
					mobile={ this.mobile }
					onMapMounted={ this.onMapMounted.bind(this) }
					onPanoramaMounted={ this.onPanoramaMounted.bind(this) }  
					panorama={ state.panorama }
					view={ store ? store.getState().view : 'map' } 
				/>
				<TwoBlocksInterchange 
					confirmingAnswer={ state.confirmingAnswer }
					guessingLocation={ state.guessingLocation }
					gameOver={ this.gameplay && this.gameplay.gameOver() }
					gameStage={ store.getState().gameStage }
					hidden={ state.interchangeHidden }
					hideReplayButton={ !(store) || !(store.getState().gameOver) }
					hoveredBorough={ state.hoveredBorough }
					mobile={ this.mobile }
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

export default TwoBlocks; 
