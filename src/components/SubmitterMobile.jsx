import React from 'react'; 
import BoroughButtonsMobile from './BoroughButtonsMobile'; 
import FinalAnswerCheckMobile from './FinalAnswerCheckMobile'; 

const SubmitterMobile = function SubmitterMobile(props) {

	const { borough, buttonClassName, submissionButtonLabel, goBackButtonLabel, onSubmissionButtonClick, onGoBackButtonClick, onTouchend, text,  twoBlocksClass } = props; 

	const boroughButtonClassName = "two-blocks-button two-blocks-mobile-button borough-selection-button";

	const finalAnswerClassName = [ "two-blocks-final-answer-button", buttonClassName ].join(' ');

	const goBackButtonClassName = [ "two-blocks-clear-selected-borough-button", buttonClassName ].join(' ');  

	const finalAnswerCheckVisibilityClass = borough ? '' : 'hidden';

	const markup = borough 

		? ( <FinalAnswerCheckMobile 
			borough={ borough }
			classList={ [ twoBlocksClass, finalAnswerCheckVisibilityClass ].join(' ') }
			goBackButtonClassName={ goBackButtonClassName }
			goBackButtonLabel={ goBackButtonLabel }
			finalAnswerClassName={ finalAnswerClassName }
			onGoBackButtonClick={ () => onGoBackButtonClick() }
			onSubmissionButtonClick={ () => onSubmissionButtonClick() }
			submissionButtonLabel={ submissionButtonLabel }
			text={ text }
		  /> )  // eslint-disable-line no-mixed-spaces-and-tabs

		: (	<BoroughButtonsMobile 
			boroughButtonClassName={ boroughButtonClassName } 
			onTouchend={ onTouchend }
			twoBlocksClass={ twoBlocksClass }
		  /> );  // eslint-disable-line no-mixed-spaces-and-tabs

	return markup; 
	
}; 

export default SubmitterMobile; 
