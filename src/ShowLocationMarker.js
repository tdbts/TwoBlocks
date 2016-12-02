/* google, L */

/*----------  Constructor  ----------*/

const ShowLocationMarker = function ShowLocationMarker(options, gameComponents) {

	const { mobile, blockLevelMap, boroughLevelMap } = gameComponents; 

	this.marker = mobile ? new L.Marker(options) : new google.maps.Marker(options); 
	this.mobile = mobile; 

}; 

/*----------  Prototype  ----------*/

ShowLocationMarker.prototype = {

	hide() {

		if (this.mobile) {

			this.marker.setOpacity(0); 

		} else {

			this.marker.setMap(null); 

		}

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
