import React from 'react'; 
import TwoBlocksPrompt from './TwoBlocksPrompt'; 
import TwoBlocksSubmitter from './TwoBlocksSubmitter'; 
import TwoBlocksReplayButton from './TwoBlocksReplayButton'; 

const INTERCHANGE_WRAPPER_CLASS_NAME = "two-blocks-interchange"; 

/*----------  Class  ----------*/

class TwoBlocksInterchange extends React.Component {

	render() {

		const { confirmingAnswer, gameStage, gameOver, guessingLocation, hidden, hoveredBorough, mobile, prompt, promptTransition, selectedBorough, hideReplayButton, onButtonClick } = this.props; 

		return (
			
			<div className={ [ INTERCHANGE_WRAPPER_CLASS_NAME, (mobile ? 'full-dimensions' : ''), (hidden ? 'offscreen' : '') ].join(' ').trim() }>
				<TwoBlocksPrompt 
					guessingLocation={ guessingLocation }
					gameOver={ gameOver }
					hoveredBorough={ hoveredBorough }
					prompt={ prompt }
					promptTransition={ promptTransition }
					wrapperClass={ "two-blocks-interchange-component" }
				/>
				<TwoBlocksSubmitter
					confirmingAnswer={ confirmingAnswer }
					gameStage={ gameStage }
					guessingLocation={ guessingLocation } 
					hoveredBorough={ hoveredBorough }
					mobile={ mobile }
					onButtonClick={ onButtonClick }
					selectedBorough={ selectedBorough }
					wrapperClass={ "two-blocks-interchange-component" }
				/>
				<TwoBlocksReplayButton 
					hidden={ hideReplayButton }
					onButtonClick={ onButtonClick }
					wrapperClass={ "two-blocks-interchange-component" }
				/>
			</div>

		);
			
	}

}

/*----------  Define PropTypes  ----------*/

TwoBlocksInterchange.propTypes = {
	confirmingAnswer: React.PropTypes.bool,
	guessingLocation: React.PropTypes.bool,  
	gameOver: React.PropTypes.bool,
	gameStage: React.PropTypes.string,
	hidden: React.PropTypes.bool,  
	hideReplayButton: React.PropTypes.bool, 
	hoveredBorough: React.PropTypes.string, 
	mobile: React.PropTypes.bool,
	onButtonClick: React.PropTypes.func.isRequired,  
	prompt: React.PropTypes.object, 
	promptTransition: React.PropTypes.string, 
	selectedBorough: React.PropTypes.string
}; 

export default TwoBlocksInterchange; 
