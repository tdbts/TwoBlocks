/* global google, L */

/*----------  Constructor  ----------*/

const ShowLocationMarker = function ShowLocationMarker(maps, mobile) {

	this.maps = maps;
	this.mobile = mobile;

	this.blockLevelMap = this.maps.getBlockLevelMap();
	this.boroughLevelMap = this.maps.getBoroughLevelMap();
	this.marker = this._createMarker();

}; 

/*----------  Prototype  ----------*/

ShowLocationMarker.prototype = {

	_createMarker() {

		const options = this._createOptions();

		return this.mobile ? new L.Marker(options) : new google.maps.Marker(options); 
	},

	_createOptions() {

		const markerOptions = {}; 

		if (this.mobile) {

			markerOptions.dragging = false; 

		} else {

			markerOptions.draggable = false; 
			markerOptions.animation = google.maps.Animation.BOUNCE; 

		}

		return markerOptions;

	},

	/*----------  Public API  ----------*/
	
	getMarker() {

		return this.marker;

	},

	hide() {

		if (this.mobile) {

			this.marker.setOpacity(0); 

		} else {

			this.marker.setMap(null); 

		}

	}, 

	placeOnBlockLevelMap() {

		this.placeOnMap(this.blockLevelMap);

	}, 

	placeOnBoroughLevelMap() {

		this.placeOnMap(this.boroughLevelMap);

	},

	placeOnMap(map) {

		if (this.mobile) {

			this.marker.setOpacity(1); 
			this.marker.addTo(map); 

		} else {

			this.marker.setMap(map); 
			this.marker.setAnimation(google.maps.Animation.BOUNCE); 
			this.marker.setVisible(true); 

		}

	}, 

	setLocation(lat, lng) {

		const latLng = this.mobile ? L.latLng(lat, lng) : new google.maps.LatLng({ lat, lng }); 

		if (this.mobile) {

			this.marker.setLatLng(latLng); 

		} else {

			this.marker.setPosition(latLng); 

		}

	}

}; 

export default ShowLocationMarker; 
