/* global window */
 
import { EventEmitter } from 'events';
import { gameStages, lifecycle, DEFAULT_MAXIMUM_ROUNDS, MAXIMUM_EVENT_EMITTER_LISTENERS } from '../../constants/constants';   
import StageManager from './StageManager';

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

		this._stageManager = new StageManager(this);

	}

	_checkCanEvaluateAnswer() {

		const { gameplay } = this.getCurrentProps();

		const { stage } = gameplay;

		const { canEvaluateAnswer, submitted } = gameplay.currentTurn;

		if ((gameStages.GUESSING_LOCATION !== stage) || canEvaluateAnswer || submitted) return;

		this._getDispatcher().canEvaluateAnswer();

	}

	_checkConfirmingAnswer(prevSelectedBorough) {

		const { selectedBorough, submitted } = this.getCurrentProps().gameplay.currentTurn;

		if ((prevSelectedBorough === selectedBorough) || !(selectedBorough) || submitted) return;

		this._getDispatcher().confirmAnswer();

	}

	_checkGameOver(prevRoundsPlayed) {

		const { roundsPlayed } = this.getCurrentProps().gameplay;

		if (prevRoundsPlayed === roundsPlayed) return;

		if (!(this.maximumRoundsPlayed(roundsPlayed))) return;

		this._getDispatcher().gameOver();

	}

	_checkGameRestart(prevGameOver) {

		const { over } = this.getCurrentProps().gameplay;

		if (!(prevGameOver) || over) return;

		this.restart();

	}

	_checkGameStage() {

		// If stage is not yet defined, stage is 'PREGAME'
		if (this.getCurrentStage()) return;

		this._getDispatcher().stagePregame();

	}

	_checkGameStarted(prevStarted) {

		if (prevStarted || !(this.getCurrentProps().gameplay.started)) return;

		this._startGamePlay();

	}

	_checkNextTurn(prevRoundsPlayed) {

		const { roundsPlayed } = this.getCurrentProps().gameplay;

		if ((prevRoundsPlayed <= roundsPlayed) || this.maximumRoundsPlayed(roundsPlayed)) return;

		this._nextTurn();

	}

	_checkStagePostgame(prevOver) {

		const { over } = this.getCurrentProps().gameplay;

		if ((prevOver === over) || !(over)) return;

		this._switchToNextGameStage();

	}

	_checkTurnComplete() {

		const { maps, gameplay } = this.getCurrentProps();

		const { showingAnswer } = maps;

		const { stage } = gameplay;

		if (gameStages.EVALUATING_ANSWER !== stage || lifecycle.AFTER !== showingAnswer) return;

		this._onTurnComplete();

	}

	_evaluateAnswer() {

		const { canEvaluateAnswer } = this.getCurrentProps().gameplay.currentTurn;

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

	_getDispatcher() {

		return this.getCurrentProps();

	}

	_getNextGameStage() {

		return this._stageManager.getNextGameStage();
	
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
		
		const { currentTurn } = this.getCurrentProps().gameplay;

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

		return this._stageManager.readyForNextStage();

	}

	_showPanorama() {

		this._switchToNextGameStage(); 

		return this._readyForNextStage()

			.catch(e => {

				throw e;

			});

	}

	_stageIsComplete() {

		return this._stageManager.stageIsComplete();

	}

	_stageLoadingPanoramaIsComplete() {

		return this.getCurrentProps().gameplay.currentTurn.randomLocation && this.viewIsComplete();

	}

	_stagePregameIsComplete() {

		return this.getCurrentProps().app.initialized && this.viewIsComplete();

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

		return this._stageManager.switchToNextGameStage();
		
	}

	/*----------  Public API  ----------*/

	answerIsCorrect(correctBorough, selectedBorough) {

		return correctBorough.getID() === selectedBorough.getID(); 

	} 

	appIsInitialized() {

		return this.getCurrentProps().app.initialized;

	}

	gameIsOver() {

		return this.getCurrentProps().gameplay.over;
	
	}

	getCurrentProps() {

		return this._props.current;

	}

	getCurrentStage() {

		return this.getCurrentProps().gameplay.stage;

	}

	getRandomLocation() {

		return this.getCurrentProps().gameplay.currentTurn.randomLocation;

	}

	getMaximumRounds() {

		return this.MAXIMUM_ROUNDS;

	}

	maximumRoundsPlayed(roundsPlayed) {

		return roundsPlayed === this.getMaximumRounds(); 

	}

	propsDidUpdate(props) {

		this._props.previous = this.getCurrentProps();
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

		const { history } = this.getCurrentProps().gameplay;

		return history.filter(turn => turn.selectedBorough.getID() === turn.randomLocation.borough.getID());

	}

	viewIsComplete() {

		return this.getCurrentProps().view.complete;

	}

}
