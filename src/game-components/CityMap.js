import { mapTypes } from '../constants/constants'; 

const CityMap = function CityMap(map, mapType) {

	this.map = map; 
	this.mapType = mapType; 

}; 

CityMap.prototype = {

	addListener(event, listener) {

		if (!(event) || ('string' !== typeof event)) return; 

		if (!(listener) || ('function' !== typeof listener)) return; 

		if (mapTypes.GOOGLE === this.mapType) {

			this.map.data.addListener(event, listener); 

		}

	}, 

	onChoosingLocation() {

		if (mapTypes.GOOGLE === this.mapType) {

			this.map.data.revertStyle(); 

		}

	}, 

	onConsideredBorough(borough, options) {

		if (mapTypes.GOOGLE === this.mapType) {

			this.map.data.overrideStyle(borough, options); 

		}

	}, 

	onGeoJSONReceived(geoJSON) {

		if (mapTypes.GOOGLE === this.mapType) {

			return this.map.data.addGeoJson(geoJSON);

		}

	}, 

	onSelectedBorough(borough, options) {

		if (!(borough)) return; 

		if (mapTypes.GOOGLE === this.mapType) {

			this.map.data.overrideStyle(borough, options); 

		}

	}, 

	onShowingPanorama() {

		if (mapTypes.GOOGLE === this.mapType) {

			this.map.data.revertStyle(); 

		}

	}, 

	onTurnComplete() {

		if (mapTypes.GOOGLE === this.mapType) {

			this.map.data.revertStyle(); 

		}

	}, 

	panTo(latLng) {

		if (mapTypes.GOOGLE === this.mapType) {

			this.map.panTo(latLng); 

		}

	}, 

	setCenter(latLng) {

		if (mapTypes.GOOGLE === this.mapType) {

			this.map.setCenter(latLng); 

		}

	}, 

	setZoom(level) {

		if (mapTypes.GOOGLE === this.mapType) {

			this.map.setZoom(level); 

		}
	}, 

	unselectBorough(borough) {

		if (!(borough)) return;  // Don't want to revert style for entire map 

		if (mapTypes.GOOGLE === this.mapType) {

			this.map.data.revertStyle(borough); 
			
		}

	}

}; 

export default CityMap; 
