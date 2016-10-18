import React from 'react'; 
import TwoBlocksPrompt from './TwoBlocksPrompt'; 
import TwoBlocksSubmitter from './TwoBlocksSubmitter'; 
import TwoBlocksReplayButton from './TwoBlocksReplayButton'; 

const INTERCHANGE_WRAPPER_CLASS_NAME = "two-blocks-interchange"; 

/*----------  Class  ----------*/

class TwoBlocksInterchange extends React.Component {

	render() {

		const { choosingLocation, gameOver, hidden, hoveredBorough, mobile, promptTwoBlocksClass, promptText, evaluateFinalAnswer, selectedBorough, submitterTwoBlocksClass, hideReplayButton, onMobileBoroughSelection, restart, replayButtonTwoBlocksClass } = this.props; 

		return (
			
			<div className={ [ INTERCHANGE_WRAPPER_CLASS_NAME, (mobile ? 'full-dimensions' : ''), (hidden ? 'offscreen' : '') ].join(' ').trim() }>
				<TwoBlocksPrompt 
					choosingLocation={ choosingLocation }
					gameOver={ gameOver }
					hoveredBorough={ hoveredBorough }
					twoBlocksClass={ promptTwoBlocksClass }
					text={ promptText }
				/>
				<TwoBlocksSubmitter
					choosingLocation={ choosingLocation } 
					hoveredBorough={ hoveredBorough }
					evaluateFinalAnswer={ evaluateFinalAnswer }
					mobile={ mobile }
					onTouchend={ onMobileBoroughSelection }
					selectedBorough={ selectedBorough }
					twoBlocksClass={ submitterTwoBlocksClass }
				/>
				<TwoBlocksReplayButton 
					hidden={ hideReplayButton }
					restart={ restart }
					twoBlocksClass={ replayButtonTwoBlocksClass }
				/>
			</div>

		);
			
	}

}

/*----------  Define PropTypes  ----------*/

TwoBlocksInterchange.propTypes = {
	choosingLocation: React.PropTypes.bool, 
	evaluateFinalAnswer: React.PropTypes.func, 
	gameOver: React.PropTypes.bool,
	hidden: React.PropTypes.bool,  
	hideReplayButton: React.PropTypes.bool, 
	hoveredBorough: React.PropTypes.string, 
	mobile: React.PropTypes.bool,
	onMobileBoroughSelection: React.PropTypes.func,  
	promptTwoBlocksClass: React.PropTypes.string, 
	promptText: React.PropTypes.string, 
	selectedBorough: React.PropTypes.string, 
	submitterTwoBlocksClass: React.PropTypes.string, 
	restart: React.PropTypes.func, 
	replayButtonTwoBlocksClass: React.PropTypes.string
}; 

export default TwoBlocksInterchange; 
