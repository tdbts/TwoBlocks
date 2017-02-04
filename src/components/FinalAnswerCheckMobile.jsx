import React from 'react'; 

const FinalAnswerCheckMobile = function FinalAnswerCheckMobile(props) {

	const { borough, buttonClassName, onButtonClick, text, wrapperClass } = props;
	
	const BOROUGH_SUBMISSION = 'BOROUGH_SUBMISSION';

	const GO_BACK = 'GO_BACK';  

	const goBackButtonLabel = "Go Back.";  

	const submissionButtonLabel = "Final answer?"; 


	const finalAnswerClassName = [ 'two-blocks-final-answer-button', buttonClassName ].join(' ');

	const goBackButtonClassName = [ 'two-blocks-clear-selected-borough-button', buttonClassName ].join(' '); 	 

	return ( 

		<div className={ [ wrapperClass, 'final-answer-check' ].join(" ").trim() }>
			<p className="two-blocks-submitter-text"> { text } <span className="two-blocks-submitter-borough-name">{ borough }</span></p>
			<button className={ finalAnswerClassName } onClick={ () => onButtonClick(BOROUGH_SUBMISSION) }>{ submissionButtonLabel }</button>
			<button className={ goBackButtonClassName } onClick={ () => onButtonClick(GO_BACK) }>{ goBackButtonLabel }</button>
		</div>

	); 

}; 

/*----------  Define PropTypes  ----------*/

FinalAnswerCheckMobile.propTypes = {
	borough: React.PropTypes.string, 
	buttonClassName: React.PropTypes.string, 
	onButtonClick: React.PropTypes.func.isRequired, 
	text: React.PropTypes.string, 
	wrapperClass: React.PropTypes.string
}; 

export default FinalAnswerCheckMobile; 
