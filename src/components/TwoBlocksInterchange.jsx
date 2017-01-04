import React from 'react'; 
import TwoBlocksPrompt from './TwoBlocksPrompt'; 
import TwoBlocksSubmitter from './TwoBlocksSubmitter'; 
import TwoBlocksReplayButton from './TwoBlocksReplayButton'; 

const INTERCHANGE_WRAPPER_CLASS_NAME = "two-blocks-interchange"; 

/*----------  Class  ----------*/

class TwoBlocksInterchange extends React.Component {

	render() {

		const { choosingLocation, gameOver, hidden, hoveredBorough, mobile, promptText, selectedBorough, hideReplayButton, onButtonClick } = this.props; 

		return (
			
			<div className={ [ INTERCHANGE_WRAPPER_CLASS_NAME, (mobile ? 'full-dimensions' : ''), (hidden ? 'offscreen' : '') ].join(' ').trim() }>
				<TwoBlocksPrompt 
					choosingLocation={ choosingLocation }
					gameOver={ gameOver }
					hoveredBorough={ hoveredBorough }
					promptText={ promptText }
					wrapperClass={ "two-blocks-interchange-component" }
				/>
				<TwoBlocksSubmitter
					choosingLocation={ choosingLocation } 
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
	choosingLocation: React.PropTypes.bool,  
	gameOver: React.PropTypes.bool,
	hidden: React.PropTypes.bool,  
	hideReplayButton: React.PropTypes.bool, 
	hoveredBorough: React.PropTypes.string, 
	mobile: React.PropTypes.bool,
	onButtonClick: React.PropTypes.func.isRequired,  
	promptText: React.PropTypes.object, 
	selectedBorough: React.PropTypes.string
}; 

export default TwoBlocksInterchange; 
