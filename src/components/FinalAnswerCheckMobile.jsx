import React from 'react'; 

const FinalAnswerCheckMobile = function FinalAnswerCheckMobile(props) {

	const { borough, classList, goBackButtonClassName, goBackButtonLabel, finalAnswerClassName, onGoBackButtonClick, onSubmissionButtonClick, submissionButtonLabel, text } = props; 

	return ( 

		<div className={ classList }>
			<p className="two-blocks-submitter-text"> { text } <span className="two-blocks-submitter-borough-name">{ borough }</span></p>
			<button className={ finalAnswerClassName } onClick={ () => onSubmissionButtonClick() }>{ submissionButtonLabel }</button>
			<button className={ goBackButtonClassName } onClick={ () => onGoBackButtonClick() }>{ goBackButtonLabel }</button>
		</div>

	); 

}; 

export default FinalAnswerCheckMobile; 
