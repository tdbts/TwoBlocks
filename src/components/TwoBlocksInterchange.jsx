import React from 'react'; 
import TwoBlocksPrompt from './TwoBlocksPrompt'; 
import TwoBlocksSubmitter from './TwoBlocksSubmitter'; 
import TwoBlocksReplayButton from './TwoBlocksReplayButton'; 

const INTERCHANGE_WRAPPER_CLASS_NAME = "two-blocks-interchange"; 

/*----------  Class  ----------*/

class TwoBlocksInterchange extends React.Component {

	render() {

		const { guessingLocation, gameOver, hidden, hoveredBorough, mobile, prompt, selectedBorough, hideReplayButton, onButtonClick } = this.props; 

		return (
			
			<div className={ [ INTERCHANGE_WRAPPER_CLASS_NAME, (mobile ? 'full-dimensions' : ''), (hidden ? 'offscreen' : '') ].join(' ').trim() }>
				<TwoBlocksPrompt 
					guessingLocation={ guessingLocation }
					gameOver={ gameOver }
					hoveredBorough={ hoveredBorough }
					prompt={ prompt }
					wrapperClass={ "two-blocks-interchange-component" }
				/>
				<TwoBlocksSubmitter
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
	guessingLocation: React.PropTypes.bool,  
	gameOver: React.PropTypes.bool,
	hidden: React.PropTypes.bool,  
	hideReplayButton: React.PropTypes.bool, 
	hoveredBorough: React.PropTypes.string, 
	mobile: React.PropTypes.bool,
	onButtonClick: React.PropTypes.func.isRequired,  
	prompt: React.PropTypes.object, 
	selectedBorough: React.PropTypes.string
}; 

export default TwoBlocksInterchange; 
