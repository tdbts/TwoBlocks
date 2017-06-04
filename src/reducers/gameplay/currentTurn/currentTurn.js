import { combineReducers } from 'redux';
import canEvaluateAnswer from './canEvaluateAnswer';
import confirmingAnswer from './confirmingAnswer';
import consideredBorough from './consideredBorough';
import selectedBorough from './selectedBorough';
import stage from './stage';
import submittedBorough from './submittedBorough';

const currentTurn = combineReducers({
	canEvaluateAnswer,
	confirmingAnswer,
	consideredBorough,
	selectedBorough,
	stage,
	submittedBorough
});

export default currentTurn;
