import React from 'react'; 
import stylizeBoroughName from './component-utils/stylizeBoroughName'; 

/*----------  Component  ----------*/

const TwoBlocksPrompt = function TwoBlocksPrompt(props) {

	const { gameOver, hoveredBorough, choosingLocation, text, twoBlocksClass } = props; 

	const showTextAddition = shouldShowTextAddition(gameOver, choosingLocation, hoveredBorough); 

	const textAddition = getTextAddition(showTextAddition, hoveredBorough);

	const headerText = getHeaderText(text, textAddition); 

	return (

		<div className={ twoBlocksClass }>
			<p>{ headerText }</p>
		</div>
	); 

}; 

/*----------  Helper Functions  ----------*/

const getHeaderText = function getHeaderText(text, textAddition) {

	return [text, textAddition].join(' '); 

}; 

const getTextAddition = function getTextAddition(showTextAddition, hoveredBorough) {

	return showTextAddition ? stylizeBoroughName(hoveredBorough) + "?" : ""; 

}; 

const shouldShowTextAddition = function shouldShowTextAddition(gameOver, choosingLocation, hoveredBorough) {

	return !(gameOver) && choosingLocation && hoveredBorough; 

}; 

/*----------  Define Proptypes  ----------*/

TwoBlocksPrompt.propTypes = {
	
	choosingLocation 	: React.PropTypes.bool.isRequired, 
	gameOver 			: React.PropTypes.bool, 
	hoveredBorough 		: React.PropTypes.string, 
	twoBlocksClass 		: React.PropTypes.string.isRequired, 
	text 				: React.PropTypes.string

}; 

/*----------  Export  ----------*/

export default TwoBlocksPrompt; 
