import React from 'react'; 

/*----------  Component  ----------*/

const SubmitterDesktop = function SubmitterDesktop(props) {

	const { borough, buttonClassName, buttonLabel, text, twoBlocksClass, onClick } = props; 

	return (
		
		<div className={ [twoBlocksClass, borough ? '' : 'hidden'].join(' ') }>
			<p className="two-blocks-submitter-text"> { text } <span className="two-blocks-submitter-borough-name">{ borough }</span></p>
			<button className={ buttonClassName } onClick={ () => onClick() }>{ buttonLabel }</button>
		</div>

	);
	
}; 

/*----------  Define Proptypes  ----------*/

SubmitterDesktop.propTypes = {

	borough: React.PropTypes.string, 
	buttonClassName: React.PropTypes.string, 
	buttonLabel: React.PropTypes.string, 
	text: React.PropTypes.string, 
	twoBlocksClass: React.PropTypes.string, 
	onClick: React.PropTypes.func

}; 

export default SubmitterDesktop; 
