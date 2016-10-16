import React from 'react'; 
import TwoBlocksPrompt from './TwoBlocksPrompt'; 
import TwoBlocksSubmitter from './TwoBlocksSubmitter'; 
import TwoBlocksReplayButton from './TwoBlocksReplayButton'; 

const { INTERCHANGE_WRAPPER_CLASS_NAME } = ["component-wrapper", "two-blocks-interchange-wrapper"]; 

/*----------  Class  ----------*/

class TwoBlocksInterchange extends React.Component {

	render() {

		const { choosingLocation, gameOver, hoveredBorough, promptTwoBlocksClass, promptText, evaluateFinalAnswer, selectedBorough, submitterTwoBlocksClass, hideReplayButton, restart, replayButtonTwoBlocksClass } = this.props; 

		return (
			
			<div className={ INTERCHANGE_WRAPPER_CLASS_NAME }>
				<TwoBlocksPrompt 
					choosingLocation={ choosingLocation }
					gameOver={ gameOver }
					hoveredBorough={ hoveredBorough }
					twoBlocksClass={ promptTwoBlocksClass }
					text={ promptText }
				/>
				<TwoBlocksSubmitter 
					hoveredBorough={ hoveredBorough }
					evaluateFinalAnswer={ evaluateFinalAnswer }
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
	gameOver: React.PropTypes.bool, 
	hoveredBorough: React.PropTypes.string, 
	promptTwoBlocksClass: React.PropTypes.string, 
	promptText: React.PropTypes.string, 
	evaluateFinalAnswer: React.PropTypes.func, 
	selectedBorough: React.PropTypes.string, 
	submitterTwoBlocksClass: React.PropTypes.string, 
	hideReplayButton: React.PropTypes.bool, 
	restart: React.PropTypes.func, 
	replayButtonTwoBlocksClass: React.PropTypes.string
}; 

export default TwoBlocksInterchange; 
