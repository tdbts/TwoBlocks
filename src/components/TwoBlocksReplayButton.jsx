import React from 'react'; 
import { TWO_BLOCKS_BUTTON_CLASS } from '../constants/constants'; 
const TWO_BLOCKS_CLASS = "two-blocks-replay-button"; 

/*----------  Component  ----------*/

const TwoBlocksReplayButton = function TwoBlocksReplayButton(props) {

	const BUTTON_TYPE = 'RESTART'; 

	const { hidden, onButtonClick } = props; 

	const calculatedClassName = getClassName(TWO_BLOCKS_CLASS, hidden); 

	return (
		<button className={ calculatedClassName } onClick={ () => onButtonClick(BUTTON_TYPE) }>Play again?</button>
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

/*----------  Define PropTypes  ----------*/

TwoBlocksReplayButton.propTypes = {
	
	hidden: React.PropTypes.bool.isRequired, 
	onButtonClick: React.PropTypes.func.isRequired

}; 

/*----------  Export  ----------*/

export default TwoBlocksReplayButton; 
