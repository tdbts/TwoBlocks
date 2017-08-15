/* global L */

import ShowLocationMarker from './ShowLocationMarker';

export default class ShowLocationMarkerMobile extends ShowLocationMarker {

	constructor(maps) {

		super(maps);

	}

	_createLatLng(lat, lng) {

		return L.latLng(lat, lng);

	}

	_createMarker() {

		return new L.Marker(this._getOptions());

	}

	_getOptions() {

		return {

			dragging: false

		};

	}

	/*----------  Public API  ----------*/
	
	hide() {

		this.getMarker().setOpacity(0);

	}

	placeOnMap(map) {

		this.getMarker().setOpacity(1);
		this.getMarker().addTo(map);

	}

	setLocation(lat, lng) {

		const latLng = this._createLatLng(lat, lng);

		this.getMarker().setLatLng(latLng);

	}

}
