import React from 'react'; 

const SubmitterMobile = function SubmitterMobile(props) {

	const { borough, buttonClassName, submissionButtonLabel, clearSelectedButtonLabel, onSubmissionButtonClick, onClearSelectedButtonClick, onTouchend, text,  twoBlocksClass } = props; 

	const boroughButtonClassName = "two-blocks-button two-blocks-mobile-button borough-selection-button";

	const finalAnswerClassName = [ "two-blocks-final-answer-button", buttonClassName ].join(' ');

	const clearSelectedBoroughClassName = [ "two-blocks-clear-selected-borough-button", buttonClassName ].join(' ');  

	const markup = borough 

		? ( <div className={ [twoBlocksClass, borough ? '' : 'hidden'].join(' ') }>
				<p className="two-blocks-submitter-text"> { text } <span className="two-blocks-submitter-borough-name">{ borough }</span></p>
				<button className={ finalAnswerClassName } onClick={ () => onSubmissionButtonClick() }>{ submissionButtonLabel }</button>
				<button className={ clearSelectedBoroughClassName } onClick={ () => onClearSelectedButtonClick() }>{ clearSelectedButtonLabel }</button>
			</div>

		  )  // eslint-disable-line no-mixed-spaces-and-tabs

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
