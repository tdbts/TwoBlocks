import { EventEmitter } from 'events';

export default class CityMaps extends EventEmitter {

	constructor() {

		super();

		this._mapLevels = {
			CITY: 'city', 
			BOROUGH: 'borough', 
			BLOCK: 'block'
		};

		this._maps = null;

	}

	_createLatLng() {}  // Subclassed
	
	_createMap() {}  // Subclassed

	_createMaps(elements) {

		const maps = {};

		for (const level in elements) {

			maps[level] = this._createMap(level, elements[level]);

		}

		return maps;

	} 

	_getOptions() {}  // Subclassed

	/*----------  Public API  ----------*/

	getBlockLevelMap() {

		return this.getMap(this._mapLevels.BLOCK);

	}

	getBoroughLevelMap() {

		return this.getMap(this._mapLevels.BOROUGH);

	} 

	getCityLevelMap() {

		return this.getMap(this._mapLevels.CITY);

	}

	getMap(level) {

		if (!(this._maps)) return;

		return this._maps[level];

	}	

	panTo() {}  // Subclassed 

	setCenter() {}  // Subclassed

}
