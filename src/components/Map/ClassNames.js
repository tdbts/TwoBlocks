export default class MapClassNames {

	constructor(mapComponent) {

		this._mapComponent = mapComponent;

		this._classNames = {
			BLOCK_LEVEL: 'two-blocks-block-map',
			BOROUGH_LEVEL: 'two-blocks-borough-map',
			CITY_LEVEL: 'two-blocks-city-map',
			COMPONENT_CLASS: 'two-blocks-map',
			FILL_CONTAINER: 'fill-container',
			INHERIT_DIMENSIONS: 'inherit-dimensions',
			LAYERED: 'layered'
		};

	}

	_getLevelClass(level) {

		let className = null;

		switch (level) {

			case 'city':

				className = this._classNames.CITY_LEVEL;

				break;

			case 'borough':

				className = this._classNames.BOROUGH_LEVEL;

				break;

			case 'block':

				className = this._classNames.BLOCK_LEVEL;

				break;

		}

		return className;

	}

	_getMapVisibilityClass(givenLevel) {

		const { level } = this._mapComponent.props;

		return (level === givenLevel ) ? 'visible' : 'offscreen';

	}

	_getVisibilityClass(isVisible) {

		return isVisible ? 'visible' : 'offscreen';

	}

	/*----------  Public API  ----------*/
	
	getContainerClass() {

		const { visible } = this._mapComponent.props;

		return [

			this._classNames.COMPONENT_CLASS,
			this._classNames.FILL_CONTAINER,
			this._getVisibilityClass(visible)

		].join(" ").trim();

	}

	getMapClass(level) {

		return [
			
			this._getLevelClass(level),
			this._classNames.INHERIT_DIMENSIONS,
			this._classNames.LAYERED,
			this._getMapVisibilityClass(level)

		].join(" ").trim();

	}

}
