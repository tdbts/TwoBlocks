import React from 'react'; 
import stylizeBoroughName from '../stylizeBoroughName'; 
import { TWO_BLOCKS_BUTTON_CLASS } from '../constants/constants'; 

/*----------  Component  ----------*/

const TwoBlocksSubmitter = function TwoBlocksSubmitter(props) {

	const { evaluateFinalAnswer, selectedBorough, twoBlocksClass } = props; 	
	const calculatedClassName = getClassName(selectedBorough); 

	const text = getText(selectedBorough); 

	const borough = getBorough(selectedBorough); 

	const buttonLabel = "Final answer?"; 

	return (

		<div className={ twoBlocksClass }>
			<p className="two-blocks-submitter-text"> { text } <span className="two-blocks-submitter-borough-name">{ borough }</span></p>
			<button className={ calculatedClassName } onClick={ () => onSubmissionButtonClick(evaluateFinalAnswer) }>{ buttonLabel }</button>
		</div>

	); 

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
