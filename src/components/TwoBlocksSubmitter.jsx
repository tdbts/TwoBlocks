import React from 'react'; 
import stylizeBoroughName from '../stylizeBoroughName';
import SubmitterDesktop from './SubmitterDesktop';  
import SubmitterMobile from './SubmitterMobile'; 
import { TWO_BLOCKS_BUTTON_CLASS } from '../constants/constants'; 

/*----------  Component  ----------*/

const TwoBlocksSubmitter = function TwoBlocksSubmitter(props) {

	const { choosingLocation, evaluateFinalAnswer, mobile, onTouchend, selectedBorough, twoBlocksClass } = props; 	

	const calculatedClassName = getClassName(selectedBorough); 

	const text = getText(selectedBorough); 

	const borough = getBorough(selectedBorough); 

	const buttonLabel = "Final answer?"; 

	const displayedComponent = (mobile && choosingLocation) 

		? <SubmitterMobile 
			buttonClassName={ calculatedClassName }
			twoBlocksClass={ twoBlocksClass }
			onTouchend={ onTouchend }
			borough={ borough }
			buttonLabel={ buttonLabel }
			text={ text }
			onClick={ () => onSubmissionButtonClick(evaluateFinalAnswer) }
		  />  // eslint-disable-line no-mixed-spaces-and-tabs

		: <SubmitterDesktop 
			borough={ borough }
			buttonClassName={ calculatedClassName }
			buttonLabel={ buttonLabel }
			text={ text }
			twoBlocksClass={ twoBlocksClass }
			onClick={ () => onSubmissionButtonClick(evaluateFinalAnswer) }
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

const onSubmissionButtonClick = function onSubmissionButtonClick(evaluateFinalAnswer) {

	return evaluateFinalAnswer(); 

}; 

/*----------  Define PropTypes  ----------*/

TwoBlocksSubmitter.propTypes = {

	evaluateFinalAnswer 	: React.PropTypes.func.isRequired, 
	selectedBorough 		: React.PropTypes.string, 
	twoBlocksClass 			: React.PropTypes.string.isRequired

}; 

/*----------  Export  ----------*/

export default TwoBlocksSubmitter; 
