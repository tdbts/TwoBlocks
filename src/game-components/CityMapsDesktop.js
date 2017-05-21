/* global google */

import { mapSources, BLOCK_LEVEL_ZOOM, BOROUGH_LEVEL_ZOOM, CITY_LEVEL_ZOOM, HOVERED_BOROUGH_FILL_COLOR, SELECTED_BOROUGH_FILL_COLOR } from '../constants/constants';
import CityMaps from './CityMaps';

export default class CityMapsDesktop extends CityMaps {

	constructor(elements) {
	
		super(elements);

		this.events = {
			MOUSEOUT: 'mouseout',
			MOUSEOVER: 'mouseover',
			CLICK: 'click'
		};

		this._maps = this._createMaps(elements);

		this._addDOMEventListenersToMaps();

	}

	_addDOMEventListenersToMaps() {

		const cityMap = this.getCityLevelMap();

		const trackedEvents = [
			this.events.MOUSEOUT, 
			this.events.MOUSEOVER, 
			this.events.CLICK
		];

		const listener = event => e => {
			this.emit(event, Object.assign(e, { 
				mapType: this.mapTypes.CITY 
			}));	
		};

		trackedEvents.forEach(event => cityMap.data.addListener(event, listener(event)));

	}

	_createMap(type, element) {

		return new google.maps.Map(element, this._getOptions(type));

	} 

	_getCenteringMethod() {

		return 'setCenter';

	}

	_getOptions(type) {

		return Object.assign({}, this.options, {
			
			mapTypeId: this.getMapTypeId(),
			zoom: this.getZoom(type)

		});

	}

	/*----------  Public API  ----------*/
	
	createLatLng(lat, lng) {

		return { lat, lng };

	} 

	getMapType() {

		return mapSources.GOOGLE;

	} 

	getMapTypeId() {

		return google.maps.MapTypeId.ROADMAP;
	
	}

	getZoom(type) {

		let zoom = null;

		if (this.mapTypes.CITY === type) {

			zoom = CITY_LEVEL_ZOOM;

		} else if (this.mapTypes.BOROUGH === type) {

			zoom = BOROUGH_LEVEL_ZOOM;

		} else if (this.mapTypes.BLOCK === type) {

			zoom = BLOCK_LEVEL_ZOOM;

		}

		return zoom;

	}


	onGuessingLocation(latLng) {

		const { lat, lng } = latLng;

		this.panTo(lat, lng);

		this.getCityLevelMap().data.revertStyle();

	}

	onConsideredBorough(borough, options = {}) {

		options = Object.assign({}, options, {
			fillColor: HOVERED_BOROUGH_FILL_COLOR
		});

		this.getCityLevelMap().data.overrideStyle(borough, options);

	}

	onGeoJSONReceived(geoJSON) {

		return this.getCityLevelMap().data.addGeoJson(geoJSON);

	}

	onSelectedBorough(borough, options = {}) {

		if (!(borough)) return; 

		options = Object.assign({}, options, {
			fillColor: SELECTED_BOROUGH_FILL_COLOR
		});

		this.getCityLevelMap().data.overrideStyle(borough, options);

	}

	onShowingPanorama() {

		this.getCityLevelMap().data.revertStyle();

	}

	onTurnComplete() {

		this.getCityLevelMap().data.revertStyle();

	}
	
	panTo(lat, lng) {

		const latLng = this.createLatLng(lat, lng);

		// this._forEachMap(map => map.panTo(latLng));
		this.getBoroughLevelMap().panTo(latLng);
		this.getBlockLevelMap().panTo(latLng);

	}

	unselectBorough(borough) {

		if (!(borough)) return; // Don't want to revert style for entire map 

		this.getCityLevelMap().data.revertStyle(borough); 

	}

}
