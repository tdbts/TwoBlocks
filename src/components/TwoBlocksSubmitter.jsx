import React from 'react'; 
import stylizeBoroughName from './component-utils/stylizeBoroughName';
import SubmitterDesktop from './SubmitterDesktop';  
import SubmitterMobile from './SubmitterMobile'; 
import { TWO_BLOCKS_BUTTON_CLASS } from '../constants/constants'; 
const TWO_BLOCKS_CLASS = 'two-blocks-submitter'; 

/*----------  Component  ----------*/

const TwoBlocksSubmitter = function TwoBlocksSubmitter(props) {

	const { confirmingAnswer, gameStage, guessingLocation, mobile, onButtonClick, selectedBorough, wrapperClass } = props; 	

	const calculatedClassName = getClassName(selectedBorough); 

	const text = getText(selectedBorough); 

	const borough = getBorough(selectedBorough); 

	const submissionButtonLabel = "Final answer?"; 

	const twoBlocksClass = [ wrapperClass, TWO_BLOCKS_CLASS ].join(" "); 

	const displayedComponent = guessingLocation ? mobile 

		? <SubmitterMobile 
			borough={ borough }
			buttonClassName={ calculatedClassName }
			confirmingAnswer={ confirmingAnswer }
			gameStage={ gameStage }
			submissionButtonLabel={ submissionButtonLabel }
			text={ text }
			onButtonClick={ onButtonClick }
			twoBlocksClass={ twoBlocksClass }
		  />  // eslint-disable-line no-mixed-spaces-and-tabs

		: <SubmitterDesktop 
			borough={ borough }
			buttonClassName={ calculatedClassName }
			onButtonClick={ onButtonClick }
			submissionButtonLabel={ submissionButtonLabel }
			text={ text }
			twoBlocksClass={ twoBlocksClass }
		  />  // eslint-disable-line no-mixed-spaces-and-tabs 

		: null; 

	return displayedComponent;  

}; 

/*----------  Helper Functions  ----------*/

const getBorough = function getBorough(selectedBorough) {

	return selectedBorough ? stylizeBoroughName(selectedBorough) : "";

}; 

const getClassName = function getClassName(selectedBorough) {

	return [
	
		"two-blocks-submitter-button", 
		TWO_BLOCKS_BUTTON_CLASS, 
		selectedBorough ? "" : "hidden"

	].join(" ").trim(); 

}; 

const getText = function getText(selectedBorough) {

	return selectedBorough ? "You chose: " : ""; 

}; 

/*----------  Define PropTypes  ----------*/

TwoBlocksSubmitter.propTypes = {
 
	selectedBorough: React.PropTypes.string

}; 

/*----------  Export  ----------*/

export default TwoBlocksSubmitter; 
