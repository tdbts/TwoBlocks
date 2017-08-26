import { gameStages, lifecycle } from '../../constants/constants';

export default class PropUpdatesManager {

	constructor(gameplay) {

		this._gameplay = gameplay;

	}

	_checkCanEvaluateAnswer() {

		const { gameplay } = this._getCurrentProps();

		const { currentTurn, stage } = gameplay;

		const { canEvaluateAnswer, submitted } = currentTurn;

		if ((gameStages.GUESSING_LOCATION !== stage) || canEvaluateAnswer || submitted) return;

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

		if (!(this._maximumRoundsPlayed(roundsPlayed))) return;

		this._getDispatcher().gameOver();

	}

	_checkGameRestart(prevGameOver) {

		const { over } = this._getCurrentProps().gameplay;

		if (!(prevGameOver) || over) return;

		this._restart();

	}

	_checkGameStage() {

		// If stage is not yet defined, stage is 'PREGAME'
		if (this._getCurrentStage()) return;

		this._getDispatcher().stagePregame();

	}

	_checkGameStarted(prevStarted) {

		if (prevStarted || !(this._getCurrentProps().gameplay.started)) return;

		this._startGamePlay();

	}

	_checkNextTurn(prevRoundsPlayed) {

		const { roundsPlayed } = this._getCurrentProps().gameplay;

		if ((prevRoundsPlayed <= roundsPlayed) || this._maximumRoundsPlayed(roundsPlayed)) return;

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

	_getCurrentProps() {

		return this._gameplay.getCurrentProps();

	}

	_getCurrentStage() {

		return this._gameplay.getCurrentStage();

	}

	_getDispatcher() {

		return this._gameplay.getDispatcher();

	}

	_getPreviousProps() {

		return this._gameplay.getPreviousProps();

	}

	_maximumRoundsPlayed(roundsPlayed) {

		return this._gameplay.maximumRoundsPlayed(roundsPlayed);

	}

	_nextTurn() {

		return this._gameplay.nextTurn();

	}

	_onTurnComplete() {

		return this._gameplay.onTurnComplete();

	}

	_restart() {

		this._gameplay.restart();

	}

	_startGamePlay() {

		return this._gameplay.startGameplay();

	}

	_switchToNextGameStage() {

		return this._gameplay.switchToNextGameStage();

	}

	/*----------  Public API  ----------*/
	
	process() {

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

}
