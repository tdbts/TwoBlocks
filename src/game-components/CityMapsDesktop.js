/* global google */

import { mapTypes, BLOCK_LEVEL_ZOOM, BOROUGH_LEVEL_ZOOM, CITY_LEVEL_ZOOM } from '../constants/constants';
import CityMaps from './CityMaps';

/*----------  Constructor  ----------*/

const CityMapsDesktop = function CityMapsDesktop(elements) {

	// Call superclass
	CityMaps.call(this, elements);
	
	this.events = {
		MOUSEOUT: 'mouseout',
		MOUSEOVER: 'mouseover',
		CLICK: 'click'
	};

	this._addDOMEventListenersToMaps();
};

/*----------  Assign Constructor  ----------*/

CityMapsDesktop.prototype.constructor = CityMapsDesktop;

/*----------  Define methods  ----------*/

const cityMapsDesktopMethods = {

	_addDOMEventListenersToMaps() {

		const cityMap = this.getCityLevelMap();

		const trackedEvents = [
			this.events.MOUSEOUT, 
			this.eents.MOUSEOVER, 
			this.events.CLICK
		];

		const listener = e => this.emit(event, { 
			event: e, 
			mapType: this.mapTypes.CITY 
		});

		trackedEvents.forEach(event => cityMap.data.addListener(event, listener));

	},

	_createMap(type, element) {

		return new google.maps.Map(element, this._getOptions(type));

	}, 

	_getOptions(type) {

		return Object.assign({}, this.options, {
			
			mapTypeId: this.getMapTypeId(),
			zoom: this.getZoom(type)

		});

	},

	/*----------  Public API  ----------*/
	
	createLatLng(lat, lng) {

		return { lat, lng };

	}, 

	getMapType() {

		return mapTypes.GOOGLE;

	}, 

	getMapTypeId() {

		return google.maps.MapTypeId.ROADMAP;
	
	},

	getZoom(type) {

		let zoom = null;

		if (this.mapTypes.CITY === type) {

			zoom = CITY_LEVEL_ZOOM;

		} else if (this.mapTypes.BOROUGH === type) {

			zoom = BOROUGH_LEVEL_ZOOM;

		} else if (this.mapTypes.BLOCK === type) {

			zoom === BLOCK_LEVEL_ZOOM;

		}

	},


	onGuessingLocation() {

		this.getCityLevelMap().data.revertStyle();

	},

	onConsideredBorough(borough, options) {

		this.getCityLevelMap().data.overrideStyle(borough, options);

	},

	onGeoJSONReceived(geoJSON) {

		this.getCityLevelMap().data.addGeoJson(geoJSON);

	},

	onSelectedBorough(borough, options) {

		if (!(borough)) return; 

		this.getCityLevelMap().data.overrideStyle(borough, options);

	},

	onShowingPanorama() {

		this.getCityLevelMap().data.revertStyle();

	},

	onTurnComplete() {

		this.getCityLevelMap().data.revertStyle();

	},

	setCenter(lat, lng) {

		const latLng = this.createLatLng(lat, lng);

		this._forEachMap(map => map.setCenter(latLng));

	},

	unselectBorough(borough) {

		if (!(borough)) return;  // Don't want to revert style for entire map 

		this.getCityLevelMap().data.revertStyle(borough); 

	}

};

/*----------  Assign methods to prototype  ----------*/

for (const method in cityMapsDesktopMethods) {
	
	CityMapsDesktop.prototype[method] = cityMapsDesktopMethods[method];

}

/*----------  Export  ----------*/

export default CityMapsDesktop;
