import { combineReducers } from 'redux';
import complete from './complete';
import currentTurn from './currentTurn/currentTurn';
import history from './history';
import randomLocation from './randomLocation';
import roundsPlayed from './roundsPlayed';
import stageRequirements from './stageRequirements';
import started from './started';

const gameplay = combineReducers({
	complete,
	currentTurn,
	history,
	randomLocation,
	roundsPlayed,
	stageRequirements,
	started
});

export default gameplay;
