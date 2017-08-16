/* global google */

import CityMaps from './CityMaps';
import Borough from '../../game-components/Borough';

export default class CityMapsDesktop extends CityMaps {

	constructor(elements) {

		super();

		this.BLOCK_LEVEL_ZOOM = 16;
		this.BOROUGH_LEVEL_ZOOM = 12;
		this.CITY_LEVEL_ZOOM = 10;

		this.mapEvents = {
			MOUSEOUT: 'mouseout',
			MOUSEOVER: 'mouseover',
			CLICK: 'click'
		};

		this._maps = this._createMaps(elements);

		this._addDOMEventListenersToMaps();

	}

	_addDOMEventListenersToMaps() {

		const cityMap = this.getCityLevelMap();

		cityMap.data.addListener(this.mapEvents.MOUSEOUT, e => this._onMouseout(e));

		cityMap.data.addListener(this.mapEvents.MOUSEOVER, e => this._onMouseover(e));

		cityMap.data.addListener(this.mapEvents.CLICK, e => this._onClick(e));

	}
	
	_createLatLng(lat, lng) {

		return { lat, lng };

	}

	_createMap(level, element) {

		return new google.maps.Map(element, this._getOptions(level));

	}

	_getMapTypeId() {

		return google.maps.MapTypeId.ROADMAP;
	
	}

	_getOptions(level) {

		return {
			center: null,
			disableDoubleClickZoom: false,  
			draggable: false, 
			keyboardShortcuts: false, 
			mapTypeControl: false,
			mapTypeId: this._getMapTypeId(),
			scrollwheel: false, 
			streetViewControl: false, 
			zoom: this._getZoom(level),
			zoomControl: false
		};

	}

	_getZoom(level) {

		let zoom = null;

		switch (level) {

			case this._mapLevels.CITY: 

				zoom = this.CITY_LEVEL_ZOOM;

				break;

			case this._mapLevels.BOROUGH: 

				zoom = this.BOROUGH_LEVEL_ZOOM;

				break;

			case this._mapLevels.BLOCK: 

				zoom = this.BLOCK_LEVEL_ZOOM;

				break;

		}

		return zoom;

	}

	_onClick(event) {

		if (!(event.feature)) return;

		this.emit(this.mapEvents.CLICK, new Borough(event.feature));

	}

	_onMouseout(event) {

		if (!(event.feature)) return;

		this.emit(this.mapEvents.MOUSEOUT, new Borough(event.feature));

	}

	_onMouseover(event) {
		
		if (!(event.feature)) return;

		this.emit(this.mapEvents.MOUSEOVER, new Borough(event.feature));

	}

	/*----------  Public API  ----------*/

	addGeoJSON(json) {

		return this.getCityLevelMap().data.addGeoJson(json);

	}

	panTo(lat, lng, level) {

		const latLng = this._createlatLng(lat, lng);

		this._maps[level].panTo(latLng);

	}

	setCenter(lat, lng, level) {

		const latLng = this._createLatLng(lat, lng);

		this._maps[level].setCenter(latLng);

	}

}
