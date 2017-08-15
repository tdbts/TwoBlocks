/* global google */

import ShowLocationMarker from './ShowLocationMarker';

export default class ShowLocationMarkerDesktop extends ShowLocationMarker {

	constructor(maps) {

		super(maps);

	}

	_createLatLng(lat, lng) {

		return new google.maps.LatLng({ lat, lng });

	}

	_createMarker() {

		return new google.maps.Marker(this._getOptions());

	}

	_getOptions() {

		return {

			draggable: false,
			animation: google.maps.Animation.BOUNCE

		};

	}

	/*----------  Public API  ----------*/
	
	hide() {

		this.getMarker().setMap(null);

	}

	placeOnMap(map) {

		this.getMarker().setMap(map);
		this.getMarker().setAnimation(google.maps.Animation.BOUNCE);
		this.getMarker().setVisible(true);

	}

	setLocation(lat, lng) {

		const latLng = this._createLatLng(lat, lng);

		this.getMarker().setPosition(latLng);

	}

}
