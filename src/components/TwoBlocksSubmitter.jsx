import React from 'react'; 
import stylizeBoroughName from './component-utils/stylizeBoroughName';
import SubmitterDesktop from './SubmitterDesktop';  
import SubmitterMobile from './SubmitterMobile'; 
import { TWO_BLOCKS_BUTTON_CLASS } from '../constants/constants'; 
const TWO_BLOCKS_CLASS = 'two-blocks-submitter'; 

/*----------  Component  ----------*/

const TwoBlocksSubmitter = function TwoBlocksSubmitter(props) {

	const { confirmingAnswer, gameStage, guessingLocation, mobile, onButtonClick, selectedBorough, wrapperClass } = props; 	

	const buttonClassName = getClassName(selectedBorough); 

	const text = getText(selectedBorough); 

	const borough = getBorough(selectedBorough); 

	const submissionButtonLabel = "Final answer?"; 

	const twoBlocksClass = [ wrapperClass, TWO_BLOCKS_CLASS ].join(" "); 

	const commonProps = {
		borough,
		buttonClassName,
		onButtonClick,
		submissionButtonLabel,
		text,
		twoBlocksClass
	};

	const mobileProps = {
		confirmingAnswer,
		gameStage
	};

	const displayedComponent = guessingLocation ? mobile 

		? <SubmitterMobile { ...commonProps } { ...mobileProps } />

		: <SubmitterDesktop { ...commonProps } />

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
