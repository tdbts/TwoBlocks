import React from 'react'; 
import stylizeBoroughName from './component-utils/stylizeBoroughName';
import SubmitterDesktop from './SubmitterDesktop';  
import SubmitterMobile from './SubmitterMobile';  

/*----------  Component  ----------*/

const TwoBlocksSubmitter = function TwoBlocksSubmitter(props) {

	const { confirmingAnswer, gameStage, guessingLocation, mobile, onButtonClick, selectedBorough, wrapperClass } = props; 	

	const buttonClassName = getClassName(selectedBorough); 

	const text = getText(selectedBorough); 

	const borough = getBorough(selectedBorough); 

	const submissionButtonLabel = "Final answer?"; 

	const twoBlocksClass = [ wrapperClass, 'two-blocks-submitter' ].join(" "); 

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
	
		'two-blocks-submitter-button', 
		'two-blocks-button', 
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
