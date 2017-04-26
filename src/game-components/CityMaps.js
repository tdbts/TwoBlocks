import { EventEmitter } from 'events';
import { DEFAULT_MAP_OPTIONS } from '../constants/constants';

/*----------  Constructor  ----------*/

const CityMaps = function CityMaps(elements) {

	// Call superclass 
	EventEmitter.call(this);

	this.options = CityMaps.prototype._getOptions();
	
	this._elements = elements;
	this._maps = this._createMaps(elements);

	this.mapTypes = {
		CITY: 'city', 
		BOROUGH: 'borough', 
		BLOCK: 'block'
	};
	
};

/*----------  Inherit EventEmitter() functionality  ----------*/

CityMaps.prototype = Object.create(EventEmitter.prototype);

/*----------  Assign Constructor  ----------*/

CityMaps.prototype.constructor = CityMaps;

/*----------  Define methods  ----------*/

const cityMapsMethods = {
	
	_createMap() {}, // Subclassed

	_createMaps(elements) {

		const maps = {};

		for (const type in elements) {

			maps[type] = this._createMap(type, elements[type]);

		}

		return maps;

	}, 

	_forEachMap(action) {

		for (const type in this._maps) {

			action(this._maps[type]);

		}

	},

	_getMap(type) {

		if (!(this._maps)) return;

		return this._maps[type];

	}, 

	_getOptions() {

		return Object.assign({}, DEFAULT_MAP_OPTIONS);

	},

	/*----------  Public API  ----------*/
	
	getBlockLevelMap() {

		return this._getMap(this.mapTypes.BLOCK);

	},

	getBoroughLevelMap() {

		return this._getMap(this.mapTypes.BOROUGH);

	}, 

	getCityLevelMap() {

		return this._getMap(this.mapTypes.CITY);

	}, 

	createLatLng() {},

	onGuessingLocation() {},

	onConsideredBorough() {},

	onGeoJSONReceived() {},

	onSelectedBorough() {},

	onShowingPanorama() {},

	onTurnComplete() {},

	panTo(lat, lng) {

		const latLng = this.createLatLng(lat, lng);

		this._forEachMap(map => map.panTo(latLng));

	},

	setCenter() {},

	unselectBorough() {}

};

/*----------  Assign methods to prototype  ----------*/

for (const method in cityMapsMethods) {
	
	CityMaps.prototype[method] = cityMapsMethods[method];

}

/*----------  Export  ----------*/

export default CityMaps;
