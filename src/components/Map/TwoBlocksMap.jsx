import React from 'react';
import { connect } from 'react-redux';
import { lifecycle, nycLocationData } from '../../constants/constants';
import Map from '../Platform/Platform';
import CityMapsDesktop from './CityMapsDesktop';
import CityMapsMobile from './CityMapsMobile';
import ShowLocationMarker from './ShowLocationMarker/ShowLocationMarker';
import AnswerDisplay from './AnswerDisplay';
import ClassNames from './ClassNames';
import DOMEventManager from './DOMEventManager';
import StageManager from './StageManager';
import Styling from './Styling';
import UpdateManager from './UpdateManager';
import VendorEventManager from './VendorEventManager';
import mapDispatchToProps from './mapDispatchToProps';
import mapStateToProps from './mapStateToProps';

class TwoBlocksMap extends React.Component {

	constructor(props) {

		super(props);

		this.mapLevels = {
			CITY: 'city',
			BOROUGH: 'borough',
			BLOCK: 'block'
		};

		this._answerDisplay = new AnswerDisplay(this);
		this._classNames = new ClassNames(this);
		this._domEventManager = new DOMEventManager(this);
		this._stageManager = new StageManager(this);
		this._styling = new Styling(this);
		this._updateManager = new UpdateManager(this);
		this._vendorEventManager = new VendorEventManager(this);

		this._geoJSON = null;
		this._mapElements = {};
		this._maps = null;
		this._showLocationMarker = null;

		this._mountHandlers = {

			BLOCK: this._onMapMounted(this.mapLevels.BLOCK),
			BOROUGH: this._onMapMounted(this.mapLevels.BOROUGH),
			CITY: this._onMapMounted(this.mapLevels.CITY)
		
		};

	}

	/*----------  React Lifecycle  ----------*/
	
	componentDidMount() {

		this._domEventManager.assignListeners(this.props);

	}

	componentDidUpdate(prevProps) {

		this._updateManager.handleUpdate(this.props, prevProps);

	}

	/*----------  Private  ----------*/
	
	_addMapElementRef(level, element) {

		this._mapElements[level] = element;

	}

	_centerCityMap() {

		if (!(this.getMaps())) return;

		const { CENTER } = nycLocationData;

		this.getMaps().setCenter(CENTER.lat, CENTER.lng, this.mapLevels.CITY);		

	}

	_centerShowingLocationMaps() {

		if (!(this.getMaps())) return;

		const location = this._getShowingLocationMapCenter();

		const { lat, lng } = location;

		this.getMaps().setCenter(lat, lng, this.mapLevels.BOROUGH);
		this.getMaps().setCenter(lat, lng, this.mapLevels.BLOCK);

	}

	_getShowingLocationMapCenter() {

		const { randomLocation, showingAnswer } = this.props;
		const { CENTER } = nycLocationData;		

		return ((lifecycle.DURING === showingAnswer) ? randomLocation : CENTER);

	}

	_onMapMounted(level) {

		return ref => {

			if (this.allMapsAreMounted()) return;

			this._addMapElementRef(level, ref);

			if (!(this.props.librariesLoaded)) return;

			this.createMaps();

			this.createShowLocationMarker();

		};

	}

	/*----------  Public API  ----------*/

	addGeoJSON(geoJSON) {

		this._geoJSON = this.getMaps().addGeoJSON(geoJSON);

	}

	addMarker(lat, lng, level) {

		const map = this._maps.getMap(level);

		this._showLocationMarker.setLocation(lat, lng);

		this._showLocationMarker.placeOnMap(map);

	}

	allMapsAreMounted() {

		return Object.keys(this._mapElements).length === Object.keys(this.mapLevels).length;

	}

	centerMaps() {

		this._centerCityMap();
		this._centerShowingLocationMaps();
		
	}

	considerBorough(borough) {

		this._styling.considerBorough(borough);

	}

	createMaps() {

		if (this._maps) return;

		this._maps = this.props.isMobile 
			
			? new CityMapsMobile(this._mapElements) 
			
			: new CityMapsDesktop(this._mapElements);
		
		this._vendorEventManager.assignListeners();

		this.centerMaps();

		this.props.onMapsCreated();

	}

	createShowLocationMarker() {

		if (this._showLocationMarker) return;

		this._showLocationMarker = new ShowLocationMarker(this._maps, this.props.isMobile);
	
	}

	getGeoJSON() {

		return this._geoJSON;
		
	}

	getMaps() {

		return this._maps;

	}

	handleGameStage() {

		this._stageManager.handleGameStage(this.props);

	}

	hideShowLocationMarker() {

		this._showLocationMarker.hide();

	}

	revertMap() {

		this._styling.revertMap();

	}

	removeShowLocationMarker() {

		const { BLOCK, BOROUGH } = this.mapLevels;

		const blockLevelMap = this._maps.getMap(BLOCK);
		const boroughLevelMap = this._maps.getMap(BOROUGH);

		this._showLocationMarker.removeFromMap(blockLevelMap);
		this._showLocationMarker.removeFromMap(boroughLevelMap);

	}

	selectBorough(borough) {

		this._styling.selectBorough(borough);

	}

	showAnswer() {

		const { showMap, stopShowingAnswer } = this.props;

		showMap();

		this._answerDisplay.start(this.props)

			.then(stopShowingAnswer);

	}

	unconsiderBorough(borough) {

		this._styling.unconsiderBorough(borough);

	}

	unselectBorough(borough) {

		this._styling.unselectBorough(borough);

	}

	render() {

		const { CITY, BOROUGH, BLOCK } = this.mapLevels;

		const onKeyDown = e => this._domEventManager.handleKeyDown(e);

		return (
			<div className={ this._classNames.getContainerClass() } onKeyDown={ onKeyDown }>
				<Map 
					className={ this._classNames.getMapClass(CITY) }
					onRef={ this._mountHandlers.CITY }
				/>
				<Map 
					className={ this._classNames.getMapClass(BOROUGH) }
					onRef={ this._mountHandlers.BOROUGH }
				/>
				<Map 
					className={ this._classNames.getMapClass(BLOCK) }
					onRef={ this._mountHandlers.BLOCK }
				/>
			</div>
		);

	}

}

export default connect(mapStateToProps, mapDispatchToProps)(TwoBlocksMap);
