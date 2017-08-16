import React from 'react';
import { connect } from 'react-redux';
import getButtonClassList from '../../getButtonClassList';
import getPromptText from '../../getPromptText';
import getSubmitterClassList from '../../getSubmitterClassList';
import mapStateToProps from './mapStateToProps';
import mapDispatchToProps from './mapDispatchToProps';

const FinalAnswerCheckMobile = function FinalAnswerCheckMobile(props) {

	const { 

		clearSelectedBorough, 
		selectedBorough, 
		submitBorough

	} = props;
	
	const containerClass = getContainerClass(selectedBorough);
	
	const goBackButtonLabel = "Go Back.";  

	const promptText = getPromptText(selectedBorough);

	const submissionButtonLabel = "Final answer?"; 

	const finalAnswerClassName = getFinalAnswerClassList(selectedBorough);

	const goBackButtonClassName = getGoBackButtonClassList(selectedBorough); 	 

	return (

		<div className={ containerClass }>

			<p className="two-blocks-submitter-text"> { promptText } <span className="two-blocks-submitter-borough-name">{ selectedBorough.getName() }</span></p>
		
			<button className={ finalAnswerClassName } onClick={ submitBorough }>{ submissionButtonLabel }</button>
		
			<button className={ goBackButtonClassName } onClick={ clearSelectedBorough }>{ goBackButtonLabel }</button>
	
		</div>

	); 

}; 

/*----------  Helper Functions  ----------*/

const getContainerClass = function getContainerClass(selectedBorough) {

	return [ 

		getSubmitterClassList(), 
		getVisibilityClass(selectedBorough),
		'final-answer-check'

	].join(" ").trim();

}; 

const getFinalAnswerClassList = function getFinalAnswerClassList(selectedBorough) {

	return [ 

		'two-blocks-final-answer-button', 
		getButtonClassList(selectedBorough) 

	].join(' ');

}; 

const getGoBackButtonClassList = function getGoBackButtonClassList(selectedBorough) {

	return [ 

		'two-blocks-clear-selected-borough-button',
		 getButtonClassList(selectedBorough) 

	].join(' ');

}; 


const getVisibilityClass = function getVisibilityClass(selectedBorough) {

	return selectedBorough ? '' : 'hidden';

}; 

export default connect(mapStateToProps, mapDispatchToProps)(FinalAnswerCheckMobile); 
