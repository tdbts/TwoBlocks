import React from 'react'; 
import TwoBlocksPrompt from './TwoBlocksPrompt'; 
import TwoBlocksSubmitter from './TwoBlocksSubmitter'; 
import TwoBlocksReplayButton from './TwoBlocksReplayButton'; 

const INTERCHANGE_WRAPPER_CLASS_NAME = "two-blocks-interchange"; 

/*----------  Class  ----------*/

class TwoBlocksInterchange extends React.Component {

	render() {

		const { choosingLocation, gameOver, hidden, hoveredBorough, mobile, promptTwoBlocksClass, promptText, evaluateFinalAnswer, clearSelectedBorough, selectedBorough, submitterTwoBlocksClass, hideReplayButton, onMobileBoroughSelection, restart, replayButtonTwoBlocksClass } = this.props; 

		return (
			
			<div className={ [ INTERCHANGE_WRAPPER_CLASS_NAME, (mobile ? 'full-dimensions' : ''), (hidden ? 'offscreen' : '') ].join(' ').trim() }>
				<TwoBlocksPrompt 
					choosingLocation={ choosingLocation }
					gameOver={ gameOver }
					hoveredBorough={ hoveredBorough }
					twoBlocksClass={ [ "two-blocks-interchange-component", promptTwoBlocksClass ].join(' ') }
					promptText={ promptText }
				/>
				<TwoBlocksSubmitter
					choosingLocation={ choosingLocation } 
					hoveredBorough={ hoveredBorough }
					evaluateFinalAnswer={ evaluateFinalAnswer }
					clearSelectedBorough={ clearSelectedBorough }
					mobile={ mobile }
					onTouchend={ onMobileBoroughSelection }
					selectedBorough={ selectedBorough }
					twoBlocksClass={ [ "two-blocks-interchange-component", submitterTwoBlocksClass ].join(' ') }
				/>
				<TwoBlocksReplayButton 
					hidden={ hideReplayButton }
					restart={ restart }
					twoBlocksClass={ [ "two-blocks-interchange-component", replayButtonTwoBlocksClass ].join(' ') }
				/>
			</div>

		);
			
	}

}

/*----------  Define PropTypes  ----------*/

TwoBlocksInterchange.propTypes = {
	choosingLocation: React.PropTypes.bool, 
	evaluateFinalAnswer: React.PropTypes.func,
	clearSelectedBorough: React.PropTypes.func, 
	gameOver: React.PropTypes.bool,
	hidden: React.PropTypes.bool,  
	hideReplayButton: React.PropTypes.bool, 
	hoveredBorough: React.PropTypes.string, 
	mobile: React.PropTypes.bool,
	onMobileBoroughSelection: React.PropTypes.func,  
	promptTwoBlocksClass: React.PropTypes.string, 
	promptText: React.PropTypes.object, 
	selectedBorough: React.PropTypes.string, 
	submitterTwoBlocksClass: React.PropTypes.string, 
	restart: React.PropTypes.func, 
	replayButtonTwoBlocksClass: React.PropTypes.string
}; 

export default TwoBlocksInterchange; 
