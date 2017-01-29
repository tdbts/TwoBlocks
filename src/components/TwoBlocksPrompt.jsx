import React from 'react'; 

const PROMPT_TEXT_CLASS_NAME = "prompt-text"; 
const TWO_BLOCKS_CLASS = "two-blocks-prompt"; 

/*----------  Component  ----------*/

const TwoBlocksPrompt = function TwoBlocksPrompt(props) {

	const { prompt, wrapperClass } = props; 

	const { content, type } = prompt; 

	const componentClasses = [ wrapperClass, TWO_BLOCKS_CLASS ].join(" "); 	
	
	const textClasses = [ PROMPT_TEXT_CLASS_NAME, type ].join(" "); 

	return (

			<div className={ componentClasses }>
				<div className={ textClasses }>
					{ content }	
				</div>
			</div>

	); 	

}; 

export default TwoBlocksPrompt; 
