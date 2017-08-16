/* global L */

import CityMaps from './CityMaps';

const ATTRIBUTION = "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>";

const URL = "https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGRidHMiLCJhIjoiY2l2dWJreXBkMDZyMjJ0cXZjYmc2YTQ4eiJ9.CorNv4UczrzVzhT8npBzwA";

export default class CityMapsMobile extends CityMaps {

	constructor(elements) {

		super();

		this.BLOCK_LEVEL_ZOOM = 15;
		this.BOROUGH_LEVEL_ZOOM = 11;
		this.CITY_LEVEL_ZOOM = 10;

		this.tileLayer = { ATTRIBUTION, URL };

		this._maps = this._createMaps(elements);

	}

	_addTileLayerAttribution(map) {

		const { ATTRIBUTION, URL } = this.tileLayer;

		L.tileLayer(URL, { attribution: ATTRIBUTION }).addTo(map);

	}
	
	_createLatLng(lat, lng) {

		return L.latLng(lat, lng);

	}

	_createMap(level, element) {

		const map = new L.Map(element, this._getOptions(level));

		this._addTileLayerAttribution(map);

		return map;

	}

	_getOptions(level) {

		return {

			center: null,
			doubleClickZoom: false,
			dragging: false,
			keyboard: false,
			scrollWheelZoom: false,
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

	/*----------  Public API  ----------*/

	panTo(lat, lng, level) {

		const latLng = this._createlatLng(lat, lng);

		this._maps[level].panTo(latLng);

	}

	setCenter(lat, lng, level) {

		const latLng = this._createLatLng(lat, lng);

		this._maps[level].setView(latLng);

	}

}
