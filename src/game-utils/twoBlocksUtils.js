import { MINIMUM_SPINNER_SCREEN_WIDTH } from '../constants/constants';
 
const twoBlocksUtils = {

	deviceIsMotionCapable: !!(window.DeviceOrientationEvent) || !!(window.DeviceMotionEvent), 

	deviceIsSmallEnoughForMotion: (window.screen.width < MINIMUM_SPINNER_SCREEN_WIDTH),

	deviceIsIpad: /iPad/g.test(window.navigator.userAgent), 

	/*----------  Methods  ----------*/
	
	loadCSS() {

		require('../../public/css/two-blocks.css');  // Use Webpack loaders to add CSS 

		if (this.shouldUseDeviceOrientation()) {

			require('../../public/css/two-blocks-mobile.css'); 

		}	

	},

	shouldUseDeviceOrientation() {
 
		const conditions = [

			this.deviceIsMotionCapable, 
			this.deviceIsSmallEnoughForMotion || this.deviceIsIpad

		]; 

		return conditions.every(condition => !!condition); 

	} 

};

export default twoBlocksUtils;
