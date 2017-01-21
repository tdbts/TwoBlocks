import React from 'react'; 
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactTransitionGroup from 'react-addons-transition-group';
import { createPromiseTimeout } from '../utils/utils';


const PROMPT_TEXT_CLASS_NAME = "prompt-text"; 

const TWO_BLOCKS_CLASS = "two-blocks-prompt"; 

/*----------  Component  ----------*/

class TwoBlocksPrompt extends React.Component {

	constructor(props) {

		super(props); 

		this.state = {

			transitioningBetweenPrompts: false, 
			transitioningOutPrompt: null

		}; 

		/*----------  Save reference to original setState() method  ----------*/
		
		this._superSetState = this.setState.bind(this); 

		/*----------  Override setState() to be promisified  ----------*/
		
		this.setState = nextState => {

			return new Promise(resolve => {

				this._superSetState(nextState, resolve); 

			}); 

		}; 		

	}

	componentDidUpdate(prevProps) {

		if (prevProps.prompt === this.props.prompt) return; 

		this.setState({

			transitioningBetweenPrompts: true, 
			transitioningOutPrompt: prevProps.prompt

		})

		.then(() => createPromiseTimeout(1000))

		.then(() => this.setState({

			transitioningBetweenPrompts: false, 
			transitioningOutPrompt: null 

		})); 

	}

	render() {

		const { prompt, wrapperClass } = this.props; 

		const { transitioningBetweenPrompts, transitioningOutPrompt } = this.state; 

		const { content } = transitioningBetweenPrompts ? transitioningOutPrompt : prompt;  

		const className = [ wrapperClass, TWO_BLOCKS_CLASS ].join(" "); 

		return (

			<div className={ className }>
				<div className={ PROMPT_TEXT_CLASS_NAME }>
					<ReactTransitionGroup>
						{ content }
					</ReactTransitionGroup>				
				</div>
			</div>
		
		); 

	}

}

/*----------  Define Proptypes  ----------*/

TwoBlocksPrompt.propTypes = {

	prompt  			: React.PropTypes.object, 
	wrapperClass 		: React.PropTypes.string

}; 

/*----------  Export  ----------*/

export default TwoBlocksPrompt; 
