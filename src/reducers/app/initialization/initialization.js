import { combineReducers } from 'redux';
import domElementsMounted from './domElementsMounted';
import gameComponentsStarted from './gameComponentsStarted';
import geoJSONLoaded from './geoJSONLoaded';
import librariesLoaded from './librariesLoaded';

const initialization = combineReducers({
	domElementsMounted, 
	gameComponentsStarted, 
	geoJSONLoaded,
	librariesLoaded
});

export default initialization;
