export default class ShowLocationMarker {

	constructor(maps, isMobile) {

		this.maps = maps;
		this.isMobile = isMobile;

		this.blockLevelMap = this.maps.getBlockLevelMap();
		this.boroughLevelMap = this.maps.getBoroughLevelMap();

		this._marker = this._createMarker();

	}

	/*----------  Public API  ----------*/
	
	getMarker() {

		return this._marker;

	}

	placeOnBlockLevelMap() {

		this.placeOnMap(this.blockLevelMap);

	}

	placeOnBoroughLevelMap() {

		this.placeOnMap(this.boroughLevelMap);

	}

}
