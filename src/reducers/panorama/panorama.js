import { combineReducers } from 'redux';
import created from './created';
import displayingLocation from './displayingLocation';
import visible from './visible';

const panorama = combineReducers({
	created,
	displayingLocation,
	visible
});

export default panorama;
