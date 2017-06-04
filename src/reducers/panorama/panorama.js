import { combineReducers } from 'redux';
import showingLocation from './showingLocation';
import visible from './visible';

const panorama = combineReducers({
	showingLocation,
	visible
});

export default panorama;
