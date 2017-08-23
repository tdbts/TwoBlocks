import { combineReducers } from 'redux';
import thrownError from './thrownError';
import initialized from './initialized';
import isMobile from './isMobile';
import initialization from './initialization/initialization';

const app = combineReducers({
	thrownError,
	initialization,
	initialized, 
	isMobile
});

export default app;
