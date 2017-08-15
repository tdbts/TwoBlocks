import { createPromiseTimeout } from '../../utils/utils';

export default class MapAnswerDisplay {

	constructor(mapComponent) {

		this._mapComponent = mapComponent;

		this.LEVEL_DISPLAY_LENGTH_MS = 2000;

	}

	_showAnswerOnMap(location, setLevel, level) {

		const { lat, lng } = location;

		this._mapComponent.addMarker(lat, lng, level);

		setLevel();

		return createPromiseTimeout(this.LEVEL_DISPLAY_LENGTH_MS)

			.then(() => this._mapComponent.removeShowLocationMarker());

	}

	_showAnswerBlockLevel(props) {

		const { BLOCK } = this._mapComponent.mapLevels;

		const { randomLocation, setMapLevelBlock } = props;

		return this._showAnswerOnMap(randomLocation, setMapLevelBlock, BLOCK)

			.then(() => this._mapComponent.removeShowLocationMarker());

	}

	_showAnswerBoroughLevel(props) {

		const { BOROUGH } = this._mapComponent.mapLevels;

		const { randomLocation, setMapLevelBorough } = props;

		return this._showAnswerOnMap(randomLocation, setMapLevelBorough, BOROUGH);

	}

	/*----------  Public API  ----------*/
	
	start(props) {

		return this._showAnswerBoroughLevel(props)

			.then(() => this._showAnswerBlockLevel(props));

	}

}
