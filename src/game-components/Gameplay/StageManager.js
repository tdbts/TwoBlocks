import { gameStages } from '../../constants/constants';

export default class StageManager {

	constructor(gameplay) {

		this._gameplay = gameplay;

	}

	_appIsInitialized() {

		return this._gameplay.appIsInitialized();

	}

	_gameIsOver() {

		return this._gameplay.gameIsOver();
	
	}

	_getCurrentProps() {

		return this._gameplay.getCurrentProps();

	}
	
	_getCurrentStage() {

		return this._gameplay.getCurrentStage();

	}

	_getRandomLocation() {

		return this._gameplay.getRandomLocation();

	}

	_stageLoadingPanoramaIsComplete() {

		return this._getRandomLocation() && this._viewIsComplete();

	}

	_stagePregameIsComplete() {

		return this._appIsInitialized() && this._viewIsComplete();

	}

	_viewIsComplete() {

		return this._gameplay.viewIsComplete();

	}

	/*----------  Public API  ----------*/

	getNextGameStage() {

		let nextStage = null; 

		const { 

			PREGAME, 
			LOADING_PANORAMA, 
			SHOWING_PANORAMA, 
			GUESSING_LOCATION, 
			EVALUATING_ANSWER, 
			POSTGAME 

		} = gameStages;

		switch (this._getCurrentStage()) {

			case null:

				nextStage = PREGAME;

				break;

			case PREGAME:

				nextStage = LOADING_PANORAMA;

				break;

			case LOADING_PANORAMA:

				nextStage = SHOWING_PANORAMA;

				break;

			case SHOWING_PANORAMA:

				nextStage = GUESSING_LOCATION;

				break;

			case GUESSING_LOCATION:

				nextStage = EVALUATING_ANSWER;

				break;

			case EVALUATING_ANSWER: 

				nextStage = this._gameIsOver() ? POSTGAME : LOADING_PANORAMA;

				break;

			case POSTGAME:

				// Handle restarts.  'PREGAME' stage only exists before first game. 
				nextStage = LOADING_PANORAMA;

				break;

		}

		return nextStage;

	}

	readyForNextStage() {

		let result = null;

		const { PROPS_UPDATE } = this._gameplay.events;

		if (this.stageIsComplete()) {

			result = Promise.resolve();

		} else {

			result = new Promise(resolve => {

				this._gameplay.on(PROPS_UPDATE, () => {

						if (!(this.stageIsComplete())) return;

						resolve();

					});

				})

				.catch(e => {

					throw e;

				});

		}

		return result;

	}

	/**
	 *
	 * Determine if the stage requirements are completed.
	 * Most stages are completed once the view completes its 
	 * designated task.
	 *
	 */
	
	stageIsComplete() {
	
		let result = false;

		switch (this._getCurrentStage()) {

			case gameStages.PREGAME:

				result = this._stagePregameIsComplete();

				break;

			case gameStages.LOADING_PANORAMA:

				result = this._stageLoadingPanoramaIsComplete();

				break;

			default:

				result = this._viewIsComplete();

				break;

		}

		return result;

	}

	switchToNextGameStage() {

		const props = this._getCurrentProps();

		switch (this.getNextGameStage()) {

			case gameStages.PREGAME: 

				props.stagePregame();

				break;

			case gameStages.LOADING_PANORAMA:

				props.stageLoadingPanorama();

				break;

			case gameStages.SHOWING_PANORAMA:

				props.stageShowingPanorama();

				break;

			case gameStages.GUESSING_LOCATION:

				props.stageGuessingLocation();

				break;

			case gameStages.EVALUATING_ANSWER:

				props.stageEvaluatingAnswer();

				break;

			case gameStages.POSTGAME:

				props.stagePostgame();

				break;

		}

	}

}
