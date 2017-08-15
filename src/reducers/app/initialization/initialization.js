import { combineReducers } from 'redux';
import cssLoaded from './cssLoaded';
import gameComponentsCreated from './gameComponentsCreated';
import geoJSONLoaded from './geoJSONLoaded';
import librariesLoaded from './librariesLoaded';

const initialization = combineReducers({
	cssLoaded,
	gameComponentsCreated, 
	geoJSONLoaded,
	librariesLoaded
});

export default initialization;
