import { gameStages } from '../../constants/constants';

export default class MapStageManager {

	constructor(mapComponent) {

		this._mapComponent = mapComponent;

	}

	_onEvaluatingAnswer(props) {

		this._mapComponent.centerMaps();

		if (props.isMobile) return;

		props.showAnswer();

	}

	_onGuessingLocation(props) {

		if (props.isMobile) return;

		props.showMap();

		this._mapComponent.revertMap();
		
	}

	_onLoadingPanorama(props) {

		if (!(props.isMobile)) {

			this._mapComponent.revertMap();
		
		}

	}

	_onPregame(props) {

		props.showMap();

	}

	_onShowingPanorama(props) {

		props.hideMap();

		if (!(props.isMobile)) {

			this._mapComponent.revertMap();
		
		}

	}

	/*----------  Public API  ----------*/
	
	handleGameStage(props) {

		switch (props.stage) {

			case gameStages.PREGAME:

				this._onPregame(props);

				break;

			case gameStages.LOADING_PANORAMA:

				this._onLoadingPanorama(props);

				break;

			case gameStages.SHOWING_PANORAMA:

				this._onShowingPanorama(props);

				break;

			case gameStages.GUESSING_LOCATION: 

				this._onGuessingLocation(props);

				break;

			case gameStages.EVALUATING_ANSWER:

				this._onEvaluatingAnswer(props);

				break;

		}		

	}

}
