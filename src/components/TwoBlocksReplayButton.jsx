import React from 'react';   

/*----------  Component  ----------*/

const TwoBlocksReplayButton = function TwoBlocksReplayButton(props) {

	const BUTTON_TYPE = 'RESTART'; 

	const { hidden, onButtonClick } = props; 

	const calculatedClassName = getClassName(hidden); 

	return (
		<button className={ calculatedClassName } onClick={ () => onButtonClick(BUTTON_TYPE) }>Play again?</button>
	);
	
}; 

/*----------  Helper Functions  ----------*/

const getClassName = function getClassName(hidden) {

	return [

		"two-blocks-button", 
		"two-blocks-replay-button", 
		hidden ? "hidden" : ""

	].join(" ").trim(); 

}; 

/*----------  Define PropTypes  ----------*/

TwoBlocksReplayButton.propTypes = {
	
	hidden: React.PropTypes.bool.isRequired, 
	onButtonClick: React.PropTypes.func.isRequired

}; 

/*----------  Export  ----------*/

export default TwoBlocksReplayButton; 
