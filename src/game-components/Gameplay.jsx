/* global window */
 
import { EventEmitter } from 'events';
import { gameStages, lifecycle, DEFAULT_MAXIMUM_ROUNDS, MAXIMUM_EVENT_EMITTER_LISTENERS } from '../constants/constants';   

export default class TwoBlocksGame extends EventEmitter {

	constructor(props) {

		super();

		this.setMaxListeners(MAXIMUM_EVENT_EMITTER_LISTENERS);

		this.events = {

			PROPS_UPDATE: 'PROPS_UPDATE'
		
		}; 

		this.MAXIMUM_ROUNDS = DEFAULT_MAXIMUM_ROUNDS; 

		this._hasStarted = false;

		this._props = {
			current: props,
			previous: null
		};

	}

	_checkCanEvaluateAnswer() {

		const { gameplay } = this._getCurrentProps();

		const { canEvaluateAnswer, submitted } = gameplay.currentTurn;

		if (canEvaluateAnswer || !(submitted)) return;

		this._getDispatcher().canEvaluateAnswer();

	}

	_checkConfirmingAnswer(prevSelectedBorough) {

		const { selectedBorough, submitted } = this._getCurrentProps().gameplay.currentTurn;

		if ((prevSelectedBorough === selectedBorough) || !(selectedBorough) || submitted) return;

		this._getDispatcher().confirmAnswer();

	}

	_checkGameOver(prevRoundsPlayed) {

		const { roundsPlayed } = this._getCurrentProps().gameplay;

		if (prevRoundsPlayed === roundsPlayed) return;

		if (!(this.maximumRoundsPlayed(roundsPlayed))) return;

		this._getDispatcher().gameOver();

	}

	_checkGameRestart(prevGameOver) {

		const { over } = this._getCurrentProps().gameplay;

		if (!(prevGameOver) || over) return;

		this.restart();

	}

	_checkGameStage() {

		// If stage is not yet defined, stage is 'PREGAME'
		if (this._getCurrentProps().gameplay.stage) return;

		this._getDispatcher().stagePregame();

	}

	_checkGameStarted(prevStarted) {

		if (prevStarted || !(this._getCurrentProps().gameplay.started)) return;

		this._startGamePlay();

	}

	_checkNextTurn(prevRoundsPlayed) {

		const { roundsPlayed } = this._getCurrentProps().gameplay;

		if ((prevRoundsPlayed <= roundsPlayed) || this.maximumRoundsPlayed(roundsPlayed)) return;

		this._nextTurn();

	}

	_checkStagePostgame(prevOver) {

		const { over } = this._getCurrentProps().gameplay;

		if ((prevOver === over) || !(over)) return;

		this._switchToNextGameStage();

	}

	_checkTurnComplete() {

		const { maps, gameplay } = this._getCurrentProps();

		const { showingAnswer } = maps;

		const { stage } = gameplay;

		if (gameStages.EVALUATING_ANSWER !== stage || lifecycle.AFTER !== showingAnswer) return;

		this._onTurnComplete();

	}

	_evaluateAnswer() {

		const { canEvaluateAnswer } = this._getCurrentProps().gameplay.currentTurn;

		if (!(canEvaluateAnswer)) return;

		this._switchToNextGameStage();

		/**
		 *
		 * 	   Perhaps what we can do is pass down as a prop a function 
		 *     which calls the 'answerIsCorrect()' method in order to 
		 *     have components determine whether the selected borough 
		 *     is correct.
		 *
		 */

		// Don't allow answer evaluation until the next turn
		this._getDispatcher().cannotEvaluateAnswer();

		return this._readyForNextStage()

			.catch(e => {

				throw e;

			});

	}

	_getCurrentProps() {

		return this._props.current;

	}

	_getDispatcher() {

		return this._getCurrentProps();

	}

	_getNextGameStage() {

		let nextStage = null; 

		const { stage } = this._getCurrentProps().gameplay;

		const { 

			PREGAME, 
			LOADING_PANORAMA, 
			SHOWING_PANORAMA, 
			GUESSING_LOCATION, 
			EVALUATING_ANSWER, 
			POSTGAME 

		} = gameStages;

		switch (stage) {

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

				nextStage = this.gameIsOver() ? POSTGAME : LOADING_PANORAMA;

				break;

			case POSTGAME:

				// Handle restarts.  'PREGAME' stage only exists before first game. 
				nextStage = LOADING_PANORAMA;

				break;

		}

		return nextStage;

	} 

	_getPreviousProps() {

		return this._props.previous;

	}

	_guessLocation() {

		this._switchToNextGameStage(); 

		return this._readyForNextStage()

			.catch(e => {

				throw e;

			});

	} 

	_loadFirstGame() {

		this._hasStarted = true;

		return this._nextTurn();	

	} 

	_loadNewGame() {

		return this._nextTurn(); 

	}

	_loadPanorama() {

		this._switchToNextGameStage(); 

		this._getDispatcher().requestRandomLocation();

		return this._readyForNextStage()

			.catch(e => {

				throw e;

			});

	} 

	_nextTurn() {

		this._getDispatcher().nextTurn();

		return this._loadPanorama()

			.then(() => this._showPanorama())

			.then(() => this._guessLocation())

			.then(() => this._evaluateAnswer()); 

	}

	_onTurnComplete() {
		
		const { currentTurn } = this._getCurrentProps().gameplay;

		const { selectedBorough } = currentTurn;

		if (!(selectedBorough)) return;  // Turn already cleared

		this._getDispatcher().saveTurn(currentTurn);
		this._getDispatcher().incrementTotalRounds();
		this._getDispatcher().clearCurrentTurn();

	} 

	_processProps() {

		if (!(this._getPreviousProps())) return;

		const {

			currentTurn,
			over,
			roundsPlayed,
			stage,
			started

		} = this._getPreviousProps().gameplay;

		this._checkCanEvaluateAnswer();

		this._checkConfirmingAnswer(currentTurn.selectedBorough);

		this._checkGameOver(roundsPlayed);

		this._checkGameStage(stage);

		// Reactive
		this._checkGameStarted(started);

		this._checkNextTurn(roundsPlayed);

		this._checkStagePostgame(over);

		// Reactive
		this._checkTurnComplete();

	}

	_readyForGameplay() {

		return this._readyForNextStage(); 

	} 

	_readyForNextStage() {

		let result = null;

		if (this._stageIsComplete()) {

			result = Promise.resolve();

		} else {

			result = new Promise(resolve => {

				this.on(this.events.PROPS_UPDATE, () => {

						if (!(this._stageIsComplete())) return;

						resolve();

					});

				})

				.catch(e => {

					throw e;

				});

		}

		return result;

	} 

	_showPanorama() {

		this._switchToNextGameStage(); 

		return this._readyForNextStage()

			.catch(e => {

				throw e;

			});

	}

	// Determine if the stage requirements are completed.  
	// Most stages are completed once the view completes its designated task.

	_stageIsComplete() {
	
		let result = false;

		const { stage } = this._getCurrentProps().gameplay;

		switch (stage) {

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

	_stageLoadingPanoramaIsComplete() {

		return this._getCurrentProps().gameplay.currentTurn.randomLocation && this._viewIsComplete();

	}

	_stagePregameIsComplete() {

		return this._getCurrentProps().app.initialized && this._viewIsComplete();

	}

	_startGamePlay() {

		return this._readyForGameplay()

			.then(() => this._hasStarted 

				? this._loadNewGame() 

				: this._loadFirstGame())

			.catch(e => {

				throw e;

			});

	}

	_switchToNextGameStage() {

		const props = this._getCurrentProps();

		const stage = this._getNextGameStage(); 

		switch (stage) {

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

	_viewIsComplete() {

		return this._getCurrentProps().view.complete;

	}

	/*----------  Public API  ----------*/

	answerIsCorrect(correctBorough, selectedBorough) {

		return correctBorough.getID() === selectedBorough.getID(); 

	} 

	gameIsOver() {

		return this._getCurrentProps().gameplay.over;
	
	}

	getMaximumRounds() {

		return this.MAXIMUM_ROUNDS;

	}

	maximumRoundsPlayed(roundsPlayed) {

		return roundsPlayed === this.getMaximumRounds(); 

	}

	propsDidUpdate(props) {

		this._props.previous = this._getCurrentProps();
		this._props.current = props;

		this._processProps();

		this.emit(this.events.PROPS_UPDATE);

	}

	restart() {

		return this.start();

	}

	start() {

		this._getDispatcher().startGame();
 
	} 

	totalCorrectAnswers() {

		const { history } = this._getCurrentProps().gameplay;

		return history.filter(turn => turn.selectedBorough.getID() === turn.randomLocation.borough.getID());

	}

}
