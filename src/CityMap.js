import { mapTypes } from './constants/constants'; 

const CityMap = function CityMap(map, mapType) {

	this.map = map; 
	this.mapType = mapType; 

}; 

CityMap.prototype = {

	onChoosingLocation() {

		if (mapTypes.GOOGLE === this.mapType) {

			this.map.data.revertStyle(); 

		}

	}, 

	onGeoJSONReceived(geoJSON) {

		if (mapTypes.GOOGLE === this.mapType) {

			return this.map.data.addGeoJson(geoJSON);

		}

	}, 

	onHoveredBorough(borough, options) {

		if (mapTypes.GOOGLE === this.mapType) {

			this.map.data.overrideStyle(borough, options); 

		}

	}, 

	onSelectedBorough(borough, options) {

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

		if (mapTypes.GOOGLE === this.mapType) {

			this.map.data.revertStyle(borough); 
			
		}

	}

}; 

export default CityMap; 
