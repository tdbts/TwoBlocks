import React from 'react'; 

const PROMPT_TEXT_CLASS_NAME = "prompt-text"; 
const TWO_BLOCKS_CLASS = "two-blocks-prompt"; 

/*----------  Component  ----------*/

const TwoBlocksPrompt = function TwoBlocksPrompt(props) {

	const { prompt, promptTransition, wrapperClass } = props; 

	const { content } = prompt; 

	const componentClasses = [ wrapperClass, TWO_BLOCKS_CLASS ].join(" "); 	
	
	let textClasses = [ PROMPT_TEXT_CLASS_NAME ]; 

	if (promptTransition) {

		textClasses.push(promptTransition); 

	}

	textClasses = textClasses.join(" "); 

	return (

		<div className={ componentClasses }>
			<div className={ textClasses }>
				{ content }	
			</div>
		</div>

	); 	

}; 

/*----------  Define PropTypes  ----------*/

TwoBlocksPrompt.propTypes = {
	prompt: React.PropTypes.object,
	promptTransition: React.PropTypes.string, 
	wrapperClass: React.PropTypes.string
}; 

export default TwoBlocksPrompt; 
