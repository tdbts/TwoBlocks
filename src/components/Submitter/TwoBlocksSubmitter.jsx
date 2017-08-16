import React from 'react';
import { connect } from 'react-redux';
import { debounce } from '../../utils/utils';
import { gameStages, KEY_PRESS_DEBOUNCE_TIMEOUT } from '../../constants/constants';
import SubmitterDesktop from './SubmitterDesktop/SubmitterDesktop';
import SubmitterMobile from './SubmitterMobile/SubmitterMobile';
import mapStateToProps from './mapStateToProps';
import mapDispatchToProps from './mapDispatchToProps';

/*----------  Component  ----------*/

const TwoBlocksSubmitter = function TwoBlocksSubmitter(props) {

	const { 

		stage, 
		isMobile

	} = props; 	

	const displayedComponent = gameStages.GUESSING_LOCATION === stage ? isMobile 

		? <SubmitterMobile />

		: <SubmitterDesktop onKeyDown={ e => onKeyDownHandler(e, props) } />

		: null; 

	return displayedComponent;

};

/*----------  Helper Functions  ----------*/

const onKeyDown = function onKeyDown(e, props) {

	const { selectedBorough, submitBorough, submitted } = props;

	if (('Enter' !== e.key) || !(selectedBorough) || submitted) return;

	submitBorough();

};

// TODO: 'throttle()' may be more useful here
const onKeyDownHandler = debounce(onKeyDown, KEY_PRESS_DEBOUNCE_TIMEOUT);


/*----------  Export  ----------*/

export default connect(mapStateToProps, mapDispatchToProps)(TwoBlocksSubmitter);
