import { gameStages } from '../../constants/constants';

export default class PromptTiming {

	constructor(prompt) {

		this._blocker = prompt.blocker;
		this._currentPromptTransitionBlocker = null;

	}

	_getPregame() {

		const waitForInitialization = this._blocker.createBlockingCondition(props => props.initialized);

		return {
			delay: 0,
			enter: 1000,
			duration: waitForInitialization,
			leave: 1000
		};

	}

	_getLoadingPanorama() {

		const MINIMUM_BLOCK_LENGTH = 1500;

		const waitForRandomLocation = this._blocker.createBlockingCondition(props => props.randomLocation, MINIMUM_BLOCK_LENGTH);

		return {
			delay: 0,
			enter: 1000,
			duration: waitForRandomLocation,
			leave: 1000
		};

	}

	_getShowingPanorama() {

		return {
			delay: 0,
			enter: 2000,  // enter transition, plus 'show-after' transition	
			duration: 0,
			leave: 1000
		};

	}

	_getGuessingLocation() {

		const waitForSelectedBorough = this._blocker.createBlockingCondition(props => props.submitted);

		return {
			delay: 0,
			enter: 500, 
			duration: waitForSelectedBorough,
			leave: 0
		};

	}

	_getEvaluatingAnswer() {

		return {
			delay: 0,
			enter: 0,
			duration: 1500,
			leave: 0
		};

	}
	
	_getPostgame() {

		const waitForGameRestart = this._blocker.createBlockingCondition(props => props.restarted);

		return {
			delay: 0,
			enter: 0,
			duration: waitForGameRestart,
			leave: 0
		};

	}

	/*----------  Public API  ----------*/

	// Eventually subclass this into a "PromptTiming" class
	getForStage(stage) {

		let timing = null;

		switch (stage) {

			case gameStages.PREGAME:

				timing = this._getPregame();

				break;

			case gameStages.LOADING_PANORAMA:

				timing = this._getLoadingPanorama();

				break;

			case gameStages.SHOWING_PANORAMA:

				timing = this._getShowingPanorama();

				break;

			case gameStages.GUESSING_LOCATION:

				timing = this._getGuessingLocation();

				break;

			case gameStages.EVALUATING_ANSWER:

				timing = this._getEvaluatingAnswer();

				break;

			case gameStages.POSTGAME:

				timing = this._getPostgame();

				break;

		}

		return timing;

	}

}
