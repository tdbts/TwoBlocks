import React from 'react'; 
import stylizeBoroughName from './component-utils/stylizeBoroughName'; 

const PROMPT_TEXT_CLASS_NAME = "prompt-text"; 

const TWO_BLOCKS_CLASS = "two-blocks-prompt"; 

/*----------  Component  ----------*/

const TwoBlocksPrompt = function TwoBlocksPrompt(props) {

	const { gameOver, hoveredBorough, choosingLocation, promptText, wrapperClass } = props; 

	const showTextAddition = shouldShowTextAddition(gameOver, choosingLocation, hoveredBorough); 

	const textAddition = showTextAddition ? <span>{ stylizeBoroughName(hoveredBorough) }?</span> : "";

	const className = [ wrapperClass, TWO_BLOCKS_CLASS ].join(" "); 

	return (

		<div className={ className }>
			<div className={ PROMPT_TEXT_CLASS_NAME }>
				<p>{ promptText } { textAddition }</p>
			</div>
		</div>
	); 

}; 

/*----------  Helper Functions  ----------*/

const shouldShowTextAddition = function shouldShowTextAddition(gameOver, choosingLocation, hoveredBorough) {

	return !(gameOver) && choosingLocation && hoveredBorough; 

}; 

/*----------  Define Proptypes  ----------*/

TwoBlocksPrompt.propTypes = {
	
	choosingLocation 	: React.PropTypes.bool.isRequired, 
	gameOver 			: React.PropTypes.bool, 
	hoveredBorough 		: React.PropTypes.string,  
	promptText 			: React.PropTypes.object, 
	wrapperClass 		: React.PropTypes.string

}; 

/*----------  Export  ----------*/

export default TwoBlocksPrompt; 
