/* global window */
 
import { EventEmitter } from 'events';
import { DEFAULT_MAXIMUM_ROUNDS, MAXIMUM_EVENT_EMITTER_LISTENERS } from '../../constants/constants';
import PropUpdatesManager from './PropUpdatesManager';
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

		this._propUpdatesManager = new PropUpdatesManager(this);
		this._stageManager = new StageManager(this);

	}

	_evaluateAnswer() {

		const { canEvaluateAnswer } = this.getCurrentProps().gameplay.currentTurn;

		if (!(canEvaluateAnswer)) return;

		this.switchToNextGameStage();

		/**
		 *
		 * 	   Perhaps what we can do is pass down as a prop a function 
		 *     which calls the 'answerIsCorrect()' method in order to 
		 *     have components determine whether the selected borough 
		 *     is correct.
		 *
		 */

		// Don't allow answer evaluation until the next turn
		this.getDispatcher().cannotEvaluateAnswer();

		return this._readyForNextStage()

			.catch(e => {

				throw e;

			});

	}

	_guessLocation() {

		this.switchToNextGameStage(); 

		return this._readyForNextStage()

			.catch(e => {

				throw e;

			});

	} 

	_loadFirstGame() {

		this._hasStarted = true;

		return this.nextTurn();	

	} 

	_loadNewGame() {

		return this.nextTurn(); 

	}

	_loadPanorama() {

		this.switchToNextGameStage(); 

		this.getDispatcher().requestRandomLocation();

		return this._readyForNextStage()

			.catch(e => {

				throw e;

			});

	} 

	_readyForGameplay() {

		return this._readyForNextStage(); 

	} 

	_readyForNextStage() {

		return this._stageManager.readyForNextStage();

	}

	_showPanorama() {

		this.switchToNextGameStage(); 

		return this._readyForNextStage()

			.catch(e => {

				throw e;

			});

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

	getDispatcher() {

		return this.getCurrentProps();

	}

	getMaximumRounds() {

		return this.MAXIMUM_ROUNDS;

	}

	getPreviousProps() {

		return this._props.previous;

	}

	getRandomLocation() {

		return this.getCurrentProps().gameplay.currentTurn.randomLocation;

	}

	maximumRoundsPlayed(roundsPlayed) {

		return roundsPlayed === this.getMaximumRounds(); 

	}

	nextTurn() {

		this.getDispatcher().nextTurn();

		return this._loadPanorama()

			.then(() => this._showPanorama())

			.then(() => this._guessLocation())

			.then(() => this._evaluateAnswer()); 

	}

	propsDidUpdate(props) {

		this._props.previous = this.getCurrentProps();
		this._props.current = props;

		this._propUpdatesManager.process();

		this.emit(this.events.PROPS_UPDATE);

	}

	onTurnComplete() {
		
		const { currentTurn } = this.getCurrentProps().gameplay;

		const { selectedBorough } = currentTurn;

		if (!(selectedBorough)) return;  // Turn already cleared

		this.getDispatcher().saveTurn(currentTurn);
		this.getDispatcher().incrementTotalRounds();
		this.getDispatcher().clearCurrentTurn();

	} 

	restart() {

		return this.start();

	}

	start() {

		this.getDispatcher().startGame();
 
	} 

	startGameplay() {

		return this._readyForGameplay()

			.then(() => this._hasStarted 

				? this._loadNewGame() 

				: this._loadFirstGame())

			.catch(e => {

				throw e;

			});

	}

	totalCorrectAnswers() {

		const { history } = this.getCurrentProps().gameplay;

		return history.filter(turn => turn.selectedBorough.getID() === turn.randomLocation.borough.getID());

	}

	viewIsComplete() {

		return this.getCurrentProps().view.complete;

	}

	switchToNextGameStage() {

		return this._stageManager.switchToNextGameStage();
		
	}

}
