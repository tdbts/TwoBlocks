import React from 'react'; 

/*----------  Component  ----------*/

const SubmitterDesktop = function SubmitterDesktop(props) {

	const BOROUGH_SUBMISSION = 'BOROUGH_SUBMISSION'; 

	const { borough, buttonClassName, onButtonClick, submissionButtonLabel, text, twoBlocksClass } = props; 

	return (
		
		<div className={ [twoBlocksClass, borough ? '' : 'hidden'].join(' ') }>
			<p className="two-blocks-submitter-text"> { text } <span className="two-blocks-submitter-borough-name">{ borough }</span></p>
			<button className={ buttonClassName } onClick={ () => onButtonClick(BOROUGH_SUBMISSION) }>{ submissionButtonLabel }</button>
		</div>

	);
	
}; 

/*----------  Define Proptypes  ----------*/

SubmitterDesktop.propTypes = {

	borough: React.PropTypes.string, 
	buttonClassName: React.PropTypes.string, 
	onButtonClick: React.PropTypes.func.isRequired, 
	submissionButtonLabel: React.PropTypes.string, 
	text: React.PropTypes.string, 
	twoBlocksClass: React.PropTypes.string

}; 

export default SubmitterDesktop; 
