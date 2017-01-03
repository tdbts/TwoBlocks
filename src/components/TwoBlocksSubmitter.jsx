import React from 'react'; 
import stylizeBoroughName from './component-utils/stylizeBoroughName';
import SubmitterDesktop from './SubmitterDesktop';  
import SubmitterMobile from './SubmitterMobile'; 
import { TWO_BLOCKS_BUTTON_CLASS } from '../constants/constants'; 

/*----------  Component  ----------*/

const TwoBlocksSubmitter = function TwoBlocksSubmitter(props) {

	const { choosingLocation, evaluateFinalAnswer, clearSelectedBorough, mobile, onTouchend, selectedBorough, twoBlocksClass } = props; 	

	const calculatedClassName = getClassName(selectedBorough); 

	const text = getText(selectedBorough); 

	const borough = getBorough(selectedBorough); 

	const submissionButtonLabel = "Final answer?"; 

	const goBackButtonLabel = "Go back."; 

	const displayedComponent = (mobile && choosingLocation) 

		? <SubmitterMobile 
			borough={ borough }
			buttonClassName={ calculatedClassName }
			goBackButtonLabel={ goBackButtonLabel }
			onTouchend={ onTouchend }
			submissionButtonLabel={ submissionButtonLabel }
			text={ text }
			onGoBackButtonClick={ () => clearSelectedBorough() }
			onSubmissionButtonClick={ () => evaluateFinalAnswer() }
			twoBlocksClass={ twoBlocksClass }
		  />  // eslint-disable-line no-mixed-spaces-and-tabs

		: <SubmitterDesktop 
			borough={ borough }
			buttonClassName={ calculatedClassName }
			submissionButtonLabel={ submissionButtonLabel }
			text={ text }
			twoBlocksClass={ twoBlocksClass }
			onSubmissionButtonClick={ () => evaluateFinalAnswer() }
		  />;  // eslint-disable-line no-mixed-spaces-and-tabs 

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

	evaluateFinalAnswer 	: React.PropTypes.func.isRequired, 
	selectedBorough 		: React.PropTypes.string, 
	twoBlocksClass 			: React.PropTypes.string.isRequired

}; 

/*----------  Export  ----------*/

export default TwoBlocksSubmitter; 
