import React from 'react'; 
import FinalAnswerCheckMobile from './FinalAnswerCheckMobile'; 

const SubmitterMobile = function SubmitterMobile(props) {

	const { borough, buttonClassName, submissionButtonLabel, clearSelectedButtonLabel, onSubmissionButtonClick, onClearSelectedButtonClick, onTouchend, text,  twoBlocksClass } = props; 

	const boroughButtonClassName = "two-blocks-button two-blocks-mobile-button borough-selection-button";

	const finalAnswerClassName = [ "two-blocks-final-answer-button", buttonClassName ].join(' ');

	const clearSelectedBoroughClassName = [ "two-blocks-clear-selected-borough-button", buttonClassName ].join(' ');  

	const finalAnswerCheckVisibilityClass = borough ? '' : 'hidden';

	const markup = borough 

		? ( <FinalAnswerCheckMobile 
			borough={ borough }
			classList={ [ twoBlocksClass, finalAnswerCheckVisibilityClass ].join(' ') }
			clearSelectedBoroughClassName={ clearSelectedBoroughClassName }
			clearSelectedButtonLabel={ clearSelectedButtonLabel }
			finalAnswerClassName={ finalAnswerClassName }
			onClearSelectedButtonClick={ () => onClearSelectedButtonClick() }
			onSubmissionButtonClick={ () => onSubmissionButtonClick() }
			submissionButtonLabel={ submissionButtonLabel }
			text={ text }
		  /> )

		: (	<div className={ twoBlocksClass }>
				<button className={ boroughButtonClassName } onClick={ () => onTouchend('Bronx') }>The Bronx</button>
				<button className={ boroughButtonClassName } onClick={ () => onTouchend('Manhattan') }>Manhattan</button>
				<button className={ boroughButtonClassName } onClick={ () => onTouchend('Queens') }>Queens</button>
				<button className={ boroughButtonClassName } onClick={ () => onTouchend('Brooklyn') }>Brooklyn</button>
				<button className={ boroughButtonClassName } onClick={ () => onTouchend('Staten Island') }>Staten Island</button>
			</div>
		  );  // eslint-disable-line no-mixed-spaces-and-tabs

	return markup; 
	
}; 

export default SubmitterMobile; 
