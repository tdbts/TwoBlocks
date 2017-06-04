import { combineReducers } from 'redux';
import map from './map';
import visible from './visible';

const marker = combineReducers({
	map, 
	visible
});

export default marker;
