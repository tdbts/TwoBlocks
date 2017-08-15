import { combineReducers } from 'redux';
import canEvaluateAnswer from './canEvaluateAnswer';
import confirmingAnswer from './confirmingAnswer';
import consideredBorough from './consideredBorough';
import randomLocation from './randomLocation';
import selectedBorough from './selectedBorough';
import submitted from './submitted';

const currentTurn = combineReducers({
	canEvaluateAnswer,
	confirmingAnswer,
	consideredBorough,
	randomLocation,
	selectedBorough,
	submitted
});

export default currentTurn;
