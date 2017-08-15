import { combineReducers } from 'redux';
import currentTurn from './currentTurn/currentTurn';
import history from './history';
import over from './over';
import roundsPlayed from './roundsPlayed';
import stageRequirements from './stageRequirements';
import restarting from './restarting';
import stage from './stage';
import started from './started';
import totalGamesPlayed from './totalGamesPlayed';

const gameplay = combineReducers({
	currentTurn,
	history,
	over,
	restarting,
	roundsPlayed,
	stage,
	stageRequirements,
	started,
	totalGamesPlayed
});

export default gameplay;
