import { combineReducers } from 'redux';
import initialized from './initialized';
import isMobile from './isMobile';
import initialization from './initialization/initialization';

const app = combineReducers({
	initialization,
	initialized, 
	isMobile
});

export default app;
