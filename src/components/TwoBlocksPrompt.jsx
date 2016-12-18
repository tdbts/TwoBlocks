import React from 'react'; 
import stylizeBoroughName from './component-utils/stylizeBoroughName'; 

const PROMPT_TEXT_CLASS_NAME = "prompt-text"; 

/*----------  Component  ----------*/

const TwoBlocksPrompt = function TwoBlocksPrompt(props) {

	const { gameOver, hoveredBorough, choosingLocation, promptText, twoBlocksClass } = props; 

	const showTextAddition = shouldShowTextAddition(gameOver, choosingLocation, hoveredBorough); 

	const textAddition = showTextAddition ? <span>{ stylizeBoroughName(hoveredBorough) }</span> : "";

	// const promptText = getPromptText(text, textAddition); 

	return (

		<div className={ twoBlocksClass }>
			<div className={ PROMPT_TEXT_CLASS_NAME }>
				{ promptText } { textAddition }
			</div>
		</div>
	); 

}; 

/*----------  Helper Functions  ----------*/

// const getPromptText = function getPromptText(text, textAddition) {

// 	return [text, textAddition].join(' '); 

// }; 

// const getTextAddition = function getTextAddition(hoveredBorough) {

// 	return showTextAddition ? <span>{ stylizeBoroughName(hoveredBorough) } + "?"</span> : null; 

// }; 

const shouldShowTextAddition = function shouldShowTextAddition(gameOver, choosingLocation, hoveredBorough) {

	return !(gameOver) && choosingLocation && hoveredBorough; 

}; 

/*----------  Define Proptypes  ----------*/

TwoBlocksPrompt.propTypes = {
	
	choosingLocation 	: React.PropTypes.bool.isRequired, 
	gameOver 			: React.PropTypes.bool, 
	hoveredBorough 		: React.PropTypes.string, 
	twoBlocksClass 		: React.PropTypes.string.isRequired, 
	promptText 			: React.PropTypes.object

}; 

/*----------  Export  ----------*/

export default TwoBlocksPrompt; 
