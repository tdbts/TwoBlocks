import { combineReducers } from 'redux';
import elements from './elements';
import hoveredBorough from './hoveredBorough';
import level from './level';
import visible from './visible';

const maps = combineReducers({
	elements,
	hoveredBorough,
	level,
	visible
});

export default maps;
