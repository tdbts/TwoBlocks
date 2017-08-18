import { combineReducers } from 'redux';
import timeLeft from './timeLeft';

const countdown = combineReducers({
	timeLeft
});

export default countdown;
