import { combineReducers } from 'redux';
import created from './created';
import hoveredBorough from './hoveredBorough';
import level from './level';
import showingAnswer from './showingAnswer';
import visible from './visible';

const maps = combineReducers({
	created,
	hoveredBorough,
	level,
	showingAnswer,
	visible
});

export default maps;
