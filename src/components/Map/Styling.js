export default class MapStyling {

	constructor(mapComponent) {

		this._mapComponent = mapComponent;

		this.CONSIDERED_BOROUGH_FILL_COLOR = "#A8FFFC";
		this.SELECTED_BOROUGH_FILL_COLOR = "#FFFFFF";		

	}

	_getCityLevelMap() {

		return this._mapComponent.getMaps().getCityLevelMap();

	}

	_revertBoroughStyle(borough) {

		this._getCityLevelMap().data.revertStyle(borough.getFeature());

	}

	/*----------  Public API  ----------*/

	revertMap() {

		this._getCityLevelMap().data.revertStyle();

	}

	considerBorough(borough) {

		const options = {
		
			fillColor: this.CONSIDERED_BOROUGH_FILL_COLOR
		
		};

		this._getCityLevelMap().data.overrideStyle(borough.getFeature(), options);

	}

	selectBorough(borough) {

		const options = {

			fillColor: this.SELECTED_BOROUGH_FILL_COLOR

		};

		this._getCityLevelMap().data.overrideStyle(borough.getFeature(), options);

	}

	unconsiderBorough(borough) {

		this._revertBoroughStyle(borough);

	}
	
	unselectBorough(borough) {

		this._revertBoroughStyle(borough);

	}


}
