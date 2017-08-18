/* global window */

import React from 'react';
import { connect } from 'react-redux';
import { lifecycle } from '../../constants/constants';
import TwoBlocksWorldView from '../WorldView/TwoBlocksWorldView';
import TwoBlocksInterchange from '../Interchange/TwoBlocksInterchange';
import TwoBlocksService from '../../services/TwoBlocksService';
import Gameplay from '../../game-components/Gameplay';
import viewProgress from './viewProgress';
import twoBlocksUtils from '../../game-utils/twoBlocksUtils';
import mapStateToProps from './mapStateToProps';
import mapDispatchToProps from './mapDispatchToProps';

class TwoBlocks extends React.Component {

	constructor(props) {

		super(props);

		this.gameplay = null;
		this.service = null;

		this._loadProcesses = {};
		this._setState = this._promisifySetState();
		this._viewProgress = viewProgress;

		// Define initial state
		this.state = {
		
			geoJSON: null
		
		};

	}

	componentWillMount() {
		
		this._detectDeviceMode();

	}

	componentDidMount() {
		
		this._addDOMEventListeners();

	}

	componentDidUpdate(prevProps) {

		const { app, service } = prevProps;

		this._checkDeviceModeDetermination(app.isMobile);

		this._checkGameComponentCreation();
		this._checkGameplayStart();
		this._checkInitializationComplete();
		this._checkViewCompletion();

		this._checkLocationRequest(service.locationRequest);

		this.updateGameplay();

	}

	_addDOMEventListeners() {

		// Prevent scrolling
		window.addEventListener('scroll', e => e.preventDefault());
		window.addEventListener('touchmove', e => e.preventDefault());

	}

	_canStartGameplay() {

		const { app, gameplay, view } = this.props;

		return !(gameplay.started) && app.initialized && view.complete;

	}

	/**
	 *
	 * The functionality of many components of the game is dependent on
	 * the player's device.  Wait until the device mode has been determined    
	 * before starting these components.
	 *
	 */

	_checkDeviceModeDetermination(prevIsMobile) {

		if (prevIsMobile === this.props.app.isMobile) return;

		this._onDeviceModeDetermination();

	}

	_checkGameComponentCreation() {

		const { app, maps, panorama } = this.props;

		const { gameComponentsCreated } = app.initialization;

		if (gameComponentsCreated || !(maps.created) || !(panorama.created)) return;

		this.props.gameComponentsCreated();

	}

	_checkGameplayStart() {

		if (!(this._canStartGameplay())) return;

		this.gameplay.start();

	}

	_checkInitializationComplete() {

		const { initialized, initialization } = this.props.app;

		const initializationComplete = Object.keys(initialization)

			.every(requirement => initialization[requirement] === true);

		if (initialized || !(initializationComplete)) return;

		this.props.appInitialized();

	}

	_checkLocationRequest(prevLocationRequest) {

		const { locationRequest } = this.props.service;

		if ((prevLocationRequest === locationRequest) || (lifecycle.DURING !== locationRequest)) return;

		this.service.getRandomLocation(this.state.geoJSON)

			.then(randomLocation => this.props.setRandomLocation(randomLocation))

			.catch(e => {

				throw e;

			});

	}

	_checkViewCompletion() {

		const { complete } = this.props.view;

		if (complete || !(this._viewProgress.isComplete(this.props))) return;

		this.props.viewComplete();

	}

	_createGameplay() {

		this.gameplay = new Gameplay(this.props); 

		window.console.log("this.gameplay:", this.gameplay); 

	}

	_createService() {

		this.service = new TwoBlocksService(this.worker); 

		window.console.log("this.service:", this.service); 

	}

	_detectDeviceMode() {

		if (twoBlocksUtils.shouldUseDeviceOrientation()) {

			this.props.setMobileApp();

		} else {

			this.props.setDesktopApp();

		}

	}

	_geoJSONRequired() {  // GeoJSON required for desktop map only

		return !(this.props.app.isMobile);

	}

	_getDeviceClass() {

		return this.props.app.isMobile ? 'mobile' : 'desktop';

	}

	_getGameContainerClass() {

		return [ 'two-blocks', this._getDeviceClass() ].join(" ").trim();

	}

	_getGeoJSON() {

		if (!(this._geoJSONRequired())) return;

		return this.service.getGeoJSON()

			.then(geoJSON => this.setState({ geoJSON }))

			.catch(e => {

				throw e;

			});

	}

	_loadExternalEntity(name, process) {

		if (this._loadProcesses[name]) return this._loadProcesses[name];

		this._loadProcesses[name] = process();

		return this._loadProcesses[name];

	}

	_loadCSS() {

		const loadCSS = [

			this._loadExternalEntity('css', () => this.service.loadCSS())
		
		];

		if (this.props.app.isMobile) {

			const mobileCSS = this._loadExternalEntity('mobile-css', () => this.service.loadMobileCSS());

			loadCSS.push(mobileCSS);

		}

		return Promise.all(loadCSS)

			.then(() => this.props.cssLoaded())

			.catch(e => {

				throw e;

			});

	}

	_loadGeoJSON() {

		return this._loadExternalEntity('geoJSON', () => this.service.loadGeoJSON()

			.then(() => this._getGeoJSON())

			.then(() => this.props.geoJSONLoaded())

			.catch(e => {

				throw e;

			}));

	}

	_loadGoogleMaps() {

		return this._loadExternalEntity('googleMaps', () => this.service.loadGoogleMaps(process.env.MAPS_API_KEY)); 	

	}

	_loadLibraries() {

		return this._loadExternalEntity('libraries', () => {

			const libraries = [

				this._loadLeaflet(),
				this._loadGoogleMaps()
			
			];

			return Promise.all(libraries)

				.then(() => this.props.librariesLoaded())

				.catch(e => {
				
					throw e;

				});

		});

	}

	_loadLeaflet() {

		return this._loadExternalEntity('leaflet', () => {

			// Keep method asynchronous, as expected 
			if (!(this.props.app.isMobile)) return Promise.resolve();  

			return this.service.loadLeaflet()

				.then(() => window.console.log("window.L:", window.L));

		});

	}

	_onDeviceModeDetermination() {

		this._createService();
		this._createGameplay();

		this._loadCSS();
		this._loadGeoJSON();
		this._loadLibraries();		

	}

	_promisifySetState() {

		/*----------  Save reference to original setState() method  ----------*/
		
		this._superSetState = this.setState.bind(this); 

		/*----------  Override setState() to be promisified  ----------*/
		
		return nextState => {

			return new Promise(resolve => {

				this._superSetState(nextState, resolve); 

			}); 

		}; 

	}

	updateGameplay() {

		if (!(this.gameplay)) return;

		this.gameplay.propsDidUpdate(this.props);

	}

	render() {

		return (
			<div className={ this._getGameContainerClass() }>
				<TwoBlocksWorldView geoJSON={ this.state.geoJSON } />
				<TwoBlocksInterchange />
			</div>
		);

	}

}

export default connect(mapStateToProps, mapDispatchToProps)(TwoBlocks);
