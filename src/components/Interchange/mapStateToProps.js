import { lifecycle } from '../../constants/constants';

export default state => {

	const { app, maps, panorama } = state;

	const { isMobile } = app;

	const hidden = isMobile && ((lifecycle.DURING === maps.showingAnswer) || (lifecycle.DURING === panorama.displayingLocation));

	return {

		hidden,
		isMobile
	
	};

};
