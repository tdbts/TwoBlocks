import { combineReducers } from 'redux';
import timeLeft from './timeLeft';
import visible from './visible';

const countdown = combineReducers({
	timeLeft, 
	visible
});

export default countdown;
