/* global google */

import React from 'react';
import { connect } from 'react-redux';
import { gameStages, lifecycle } from '../../constants/constants';
import twoBlocksUtils from '../../game-utils/twoBlocksUtils';
import Panorama from '../Platform/Platform';
import Display from './Display/Display';
import Countdown from './Countdown/TwoBlocksCountdown';
import removeStreetNameAnnotations from './removeStreetNameAnnotations';
import mapStateToProps from './mapStateToProps';
import mapDispatchToProps from './mapDispatchToProps';

/*----------  TwoBlocksPanorama  ----------*/

class TwoBlocksPanorama extends React.Component {

	constructor(props) {

		super(props);

		this._classNames = {

			COMPONENT_CLASS: 'two-blocks-panorama',
			INHERIT_DIMENSIONS: 'inherit-dimensions',
			LAYERED: 'layered'
		
		};

		this._panoramaEvents = {

			PANO_CHANGED: 'pano_changed'

		};

		this._display = null;
		this._defaultOptions = null;
		this._panorama = null;
		this._ref = null;

	}

	componentDidUpdate(prevProps) {

		this._checkForLocationUpdate(prevProps.randomLocation);

		this._checkIfDisplayingLocation(prevProps.displayingLocation);
		
		this._checkIfShowingAnswer(prevProps.showingAnswer);

		this._checkGameStageChanges(prevProps.stage);

		this._checkPanoramaLoadPrerequisites();

		this._checkPanoramaDisplayPrerequisites();

	}

	_assignDisplayEventListeners() {

		const { events } = this._display;

		const { 

			isMobile, 
			setCountdownTime,
			startCountdown 

		} = this.props;

		this._display.once(events.DISPLAY_STOP, () => this._onDisplayStop());

		if (isMobile) {

			this._display.once(events.COUNTDOWN_START, timeLeft => startCountdown(timeLeft));

			this._display.on(events.COUNTDOWN_TICK, timeLeft => setCountdownTime(timeLeft));

		}

	}

	_checkForLocationUpdate(previousLocation) {

		if (previousLocation === this.props.randomLocation) return;

		this.setLocation(this.props.randomLocation);

	}

	_checkGameStageChanges(previousStage) {

		if (previousStage === this.props.stage) return;

		switch (this.props.stage) {

			case gameStages.SHOWING_PANORAMA:

				this._onStageShowingPanorama();

				break;

			case gameStages.GUESSING_LOCATION:

				this._onStageGuessingLocation();

				break;

			case gameStages.EVALUATING_ANSWER:

				this._onStageEvaluatingAnswer();

				break;

		}

	}

	_checkIfDisplayingLocation(wasDisplaying) {

		// Ensure change occurred
		if (wasDisplaying === this.props.displayingLocation) return;

		const { DURING, AFTER } = lifecycle;

		switch (this.props.displayingLocation) {

			case DURING:

				this._onDisplayingLocation();

				break;

			case AFTER:

				this._onStoppedDisplayingLocation();

				break;

		}

	}

	_checkIfShowingAnswer(prevShowingAnswer) {

		const { hidePanorama, showingAnswer } = this.props;

		if ((prevShowingAnswer === showingAnswer) || !(showingAnswer)) return;

		hidePanorama();

	}

	_checkPanoramaDisplayPrerequisites() {

		const { BEFORE, AFTER } = lifecycle;
		
		const { 

			displayLocation,
			displayingLocation, 
			isMobile,
			prompt, 
			stage, 
			visible 

		} = this.props;

		if ((gameStages.SHOWING_PANORAMA !== stage) 

			|| (BEFORE !== displayingLocation) 

			|| !(visible)) return;

		if (isMobile && (AFTER !== prompt.displaying)) return;

		displayLocation();

	}

	_checkPanoramaLoadPrerequisites() {

		if (this._panorama || !(this.props.librariesLoaded) || !(this._ref)) return;

		this._createPanorama();

	}

	_createPanorama() {

		this._defaultOptions = this._getDefaultOptions(this._ref);
		
		this._panorama = this._loadVendorPanorama(this._ref, this._defaultOptions);

		this._listenForPanoramaEvents(this._panorama);

		this.props.panoramaCreated();

	}

	_getClassName() {

		return [

			this._classNames.COMPONENT_CLASS,
			this._classNames.INHERIT_DIMENSIONS,
			this._classNames.LAYERED,
			this._getVisibilityClass(this.props.visible)

		].join(" ").trim();

	}

	_getContainerClassName() {

		return [

			"two-blocks-panorama-container",
			"fill-container"			

		].join(" ").trim();

	}

	_getDefaultOptions(ref) {

		const position = google.maps.ControlPosition.TOP_LEFT;

		return {
			// Address control shows a box with basic information about the 
			// location, as well as a link to see the map on Google Maps 
			addressControl: false,
			addressControlOptions: { position },
			// clickToGo shows a rectangular "highlight" under the cursor, and on 
			// click, the street view moves to the location clicked upon.  We will 
			// want to keep this disabled for the game.			
			clickToGo: false,
			disableDoubleClickZoom: true,
			// Below, we add an event listener to 'closeclick', which fires when 
			// the close button is clicked.  In the original author's implementation, 
			// the application reveals the map on 'closeclick'.  			
			enableCloseButton: false,
			fullscreenControl: false,
			imageDateControl: false,
			linksControl: false,
			mode: this._getGraphicsMode(ref),
			// Pan Control shows a UI element that allows you to rotate the pano 
			panControl: false,
			panControlOptions: { position },
			pano: null,  // ID of panorama to use 
			position: null,
			pov: {
				zoom: 1.1,		
				heading: 0,
				pitch: 0
			},
			scrollwheel: false,
			visible: true,
			// Zoom control functionality is obvious 
			zoomControl: false,
			zoomControlOptions: {
				position, 
				style: google.maps.ZoomControlStyle.DEFAULT
			}
		};	

	}

	_getGraphicsMode() {

		return twoBlocksUtils.detectWebGL() ? "webgl" : "html5";

	}

	_getVisibilityClass(isVisible) {

		return isVisible ? 'visible' : 'offscreen';

	}

	_listenForPanoramaEvents(panorama) {

		google.maps.event.addListener(panorama, this._panoramaEvents.PANO_CHANGED, () => this._onPanoChanged(panorama));		

	}

	_loadVendorPanorama(element, options) {

		return new google.maps.StreetViewPanorama(element, options);

	}

	_onDisplayStop() {

		const { 

			isMobile, 
			stopDisplayingLocation,
			stopShowingPanorama 

		} = this.props;

		stopDisplayingLocation();

		if (!(isMobile)) {

			stopShowingPanorama();

		}		

	}

	_onDisplayingLocation() {

		this._display = new Display(this._panorama, this.props.isMobile);

		this._assignDisplayEventListeners();
		this._startMotionControl();

		this._display.start();

	}

	_onPanoChanged(panorama) {

		removeStreetNameAnnotations(panorama);

	}

	_onRef(ref) {

		this._ref = ref;

		this._checkPanoramaLoadPrerequisites();

	}

	/**
	 *
	 * Ultimately, will refactor 'mapStateToProps()' 
	 * to reduce game state to 'show' and 'hide' props,
	 * calculated based off of the current state.  
	 * In other words, the Panorama will ultimately 
	 * know nothing about whether to show the panorama 
	 * if it is mobile / desktop or not.  Rather, that 
	 * calculation will be performed in an outside entity, 
	 * and reduce the determination to a single boolean, 
	 * which is then passed to the Panorama as a prop.
	 *
	 */
	
	_onStageEvaluatingAnswer() {

	}

	_onStageGuessingLocation() {

		// On mobile devices, panorama continues to be 
		// visible in the background when guessing location

		if (!(this.props.isMobile)) {

			this.props.hidePanorama();
			this.props.stopDisplayingLocation();

		}

	}

	_onStageShowingPanorama() {

		this.props.showPanorama();
	
	}

	_onStoppedDisplayingLocation() {

		this._stopMotionControl();

	}

	_startMotionControl() {

		if (!(this.props.isMobile)) return;

		this.setOptions({

			motionTracking: true,
			motionControl: true
		
		});

	}

	_stopMotionControl() {

		if (!(this.props.isMobile)) return;

		this.setOptions({

			motionTracking: false,
			motionControl: false

		});

	}

	setLocation(latLng) {

		if (!(this._panorama)) {

			window.console.warn("Panorama does not yet exist.  Cannot set location.");

			return;

		}

		this._panorama.setPosition(latLng);

	}

	setOptions(options) {

		if (!(this._panorama)) {

			window.console.warn("Panorama does not yet exist.  Cannot set options.");

			return;

		}

		this._panorama.setOptions(options);		

	}

	render() {

		return (

			<div className={ this._getContainerClassName() }>
				<Panorama
					className={ this._getClassName() }
					onRef={ ref => this._onRef(ref) } 
				/>
				<Countdown />
			</div>

		);

	}

}

export default connect(mapStateToProps, mapDispatchToProps)(TwoBlocksPanorama);
