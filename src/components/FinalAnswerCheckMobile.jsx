import React from 'react'; 

const FinalAnswerCheckMobile = function FinalAnswerCheckMobile(props) {

	const { borough, classList, clearSelectedBoroughClassName, clearSelectedButtonLabel, finalAnswerClassName, onClearSelectedButtonClick, onSubmissionButtonClick, submissionButtonLabel, text } = props; 

	return ( 

		<div className={ classList }>
			<p className="two-blocks-submitter-text"> { text } <span className="two-blocks-submitter-borough-name">{ borough }</span></p>
			<button className={ finalAnswerClassName } onClick={ () => onSubmissionButtonClick() }>{ submissionButtonLabel }</button>
			<button className={ clearSelectedBoroughClassName } onClick={ () => onClearSelectedButtonClick() }>{ clearSelectedButtonLabel }</button>
		</div>

	); 

}; 

export default FinalAnswerCheckMobile; 
