import React from 'react'; 

/*----------  Component  ----------*/

const SubmitterDesktop = function SubmitterDesktop(props) {

	const { borough, buttonClassName, submissionButtonLabel, text, twoBlocksClass, onSubmissionButtonClick } = props; 

	return (
		
		<div className={ [twoBlocksClass, borough ? '' : 'hidden'].join(' ') }>
			<p className="two-blocks-submitter-text"> { text } <span className="two-blocks-submitter-borough-name">{ borough }</span></p>
			<button className={ buttonClassName } onClick={ () => onSubmissionButtonClick() }>{ submissionButtonLabel }</button>
		</div>

	);
	
}; 

/*----------  Define Proptypes  ----------*/

SubmitterDesktop.propTypes = {

	borough: React.PropTypes.string, 
	buttonClassName: React.PropTypes.string, 
	submissionButtonLabel: React.PropTypes.string, 
	text: React.PropTypes.string, 
	twoBlocksClass: React.PropTypes.string, 
	onSubmissionButtonClick: React.PropTypes.func

}; 

export default SubmitterDesktop; 
