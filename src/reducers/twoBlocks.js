import { combineReducers } from 'redux'; 
import app from './app/app';
import countdown from './countdown/countdown';
import gameplay from './gameplay/gameplay';
import interchange from './interchange/interchange';
import maps from './maps/maps';
import marker from './marker/marker';
import panorama from './panorama/panorama';
import prompt from './prompt/prompt';
import service from './service/service';
import view from './view/view';

const twoBlocks = combineReducers({
	app,
	countdown,
	gameplay,
	interchange,
	maps,
	marker,
	panorama,
	prompt,
	service,
	view
}); 

export default twoBlocks; 
