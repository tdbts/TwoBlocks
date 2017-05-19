/* global L */

import { mapSources, tileLayer, BLOCK_LEVEL_ZOOM, BOROUGH_LEVEL_ZOOM, CITY_LEVEL_ZOOM } from '../constants/constants';
import CityMaps from './CityMaps';

/*----------  Constructor  ----------*/

const CityMapsMobile = function CityMapsMobile(elements) {

	CityMaps.call(this, elements);
	
	this._maps = this._createMaps(elements);

};

/*----------  Inherit from CityMaps  ----------*/

CityMapsMobile.prototype = Object.create(CityMaps.prototype);

/*----------  Assign Constructor  ----------*/

CityMapsMobile.prototype.constructor = CityMapsMobile;

/*----------  Define methods  ----------*/

const cityMapsMobileMethods = {

	_addTileLayerAttribution(map) {

		const { ATTRIBUTION, URL } = tileLayer;

		L.tileLayer(URL, { attribution: ATTRIBUTION }).addTo(map);

	},

	_createMap(type, element) {

		const map = new L.Map(element, this._getOptions(type));

		this._addTileLayerAttribution(map);

		return map;

	}, 

	_getOptions(type) {

		return Object.assign({}, this.options, {
			
			zoom: this.getZoom(type)

		});

	}, 

	_getCenteringMethod() {

		return 'setView';

	},
	
	/*----------  Public API  ----------*/
	
	createLatLng(lat, lng) {

		return L.latLng(lat, lng);

	}, 

	getMapType() {

		return mapSources.LEAFLET;

	}, 

	getZoom(type) {

		let zoom = null;
 
		if (this.mapTypes.CITY === type) {

			zoom = CITY_LEVEL_ZOOM;

		} else if (this.mapTypes.BOROUGH === type) {

			zoom = BOROUGH_LEVEL_ZOOM - 1;

		} else if (this.mapTypes.BLOCK === type) {

			zoom = BLOCK_LEVEL_ZOOM - 1;

		}

		return zoom;

	}, 

	onTurnComplete() {

		// Need to implement marker 
		// this.getBlockLevelMap().removeLayer(this.getMarker());

	},

	panTo(lat, lng) {

		const latLng = this.createLatLng(lat, lng);

		this._forEachMap(map => map.panTo(latLng));

	}

};

/*----------  Assign methods to prototype  ----------*/

for (const method in cityMapsMobileMethods) {
	
	CityMapsMobile.prototype[method] = cityMapsMobileMethods[method];

}

/*----------  Export  ----------*/

export default CityMapsMobile;
