import React from 'react'; 
import { TWO_BLOCKS_BUTTON_CLASS } from '../constants/constants'; 

/*----------  Component  ----------*/

const TwoBlocksReplayButton = function TwoBlocksReplayButton(props) {

	const { hidden, restart, twoBlocksClass } = props; 

	const calculatedClassName = getClassName(twoBlocksClass, hidden); 

	return (
		<button className={ calculatedClassName } onClick={ () => onReplayButtonClick(restart) }>Play again?</button>
	);
	
}; 

/*----------  Helper Functions  ----------*/

const getClassName = function getClassName(twoBlocksClass, hidden) {

	return [

		twoBlocksClass, 
		TWO_BLOCKS_BUTTON_CLASS, 
		hidden ? "hidden" : ""

	].join(" ").trim(); 

}; 

const onReplayButtonClick = function onReplayButtonClick(restart) {
	window.console.log("onReplayButtonClick()"); 
	window.console.log("restart:", restart); 
	return restart(); 

}; 

/*----------  Define PropTypes  ----------*/

TwoBlocksReplayButton.propTypes = {
	
	hidden: React.PropTypes.bool.isRequired, 
	restart: React.PropTypes.func.isRequired, 
	twoBlocksClass: React.PropTypes.string.isRequired

}; 

/*----------  Export  ----------*/

export default TwoBlocksReplayButton; 
