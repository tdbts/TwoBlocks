import { EventEmitter } from 'events';
import { DEFAULT_MAP_OPTIONS } from '../constants/constants';

export default class CityMaps extends EventEmitter {

	constructor(elements) {
		
		super();

		this.options = CityMaps.prototype._getOptions();

		this._currentCoords = null;	
		this._elements = elements;
		this._maps = null;

		this.mapTypes = {
			CITY: 'city', 
			BOROUGH: 'borough', 
			BLOCK: 'block'
		};

	}
	
	_createMap() {} // Subclassed

	_createMaps(elements) {

		const maps = {};

		for (const type in elements) {

			maps[type] = this._createMap(type, elements[type]);

		}

		return maps;

	} 

	_forEachMap(action) {

		for (const type in this._maps) {

			action(this._maps[type], type);

		}

	}

	_getMap(type) {

		if (!(this._maps)) return;

		return this._maps[type];

	}

	_getOptions() {

		return Object.assign({}, DEFAULT_MAP_OPTIONS);

	}

	/*----------  Public API  ----------*/

	createLatLng() {}
	
	getBlockLevelMap() {

		return this._getMap(this.mapTypes.BLOCK);

	}

	getBoroughLevelMap() {

		return this._getMap(this.mapTypes.BOROUGH);

	} 

	getCityLevelMap() {

		return this._getMap(this.mapTypes.CITY);

	} 

	getCurrentCoords() {

		return this._currentCoords;

	}

	onAnswerEvaluated(lat, lng) {

		this.setCenter(lat, lng, this.mapTypes.BOROUGH);
		this.setCenter(lat, lng, this.mapTypes.BLOCK);

	}

	onGuessingLocation() {}

	onConsideredBorough() {}

	onGeoJSONReceived() {}

	onSelectedBorough() {}

	onShowingPanorama() {}

	onTurnComplete() {}

	panTo() {}

	setCenter(lat, lng, type) {

		const latLng = this.createLatLng(lat, lng);

		if (type) {

			const map = this._maps[type]; 

			if (!(map)) return;

			map[this._getCenteringMethod()](latLng);

		} else {

			this._forEachMap(map => map[this._getCenteringMethod()](latLng));
		
		}

	}

	setCurrentCoords(lat, lng) {

		this._currentCoords = { lat, lng };

	}

	unselectBorough() {}

}
