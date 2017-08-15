import React from 'react';
import { connect } from 'react-redux';
import TwoBlocksPrompt from '../Prompt/TwoBlocksPrompt.refactor'; 
import TwoBlocksSubmitter from '../Submitter/TwoBlocksSubmitter.refactor'; 
import TwoBlocksReplayButton from '../ReplayButton/TwoBlocksReplayButton.refactor';
import mapStateToProps from './mapStateToProps';

/*----------  Class  ----------*/

class TwoBlocksInterchange extends React.Component {

	_getContainerClass(isMobile, hidden) {

		return [

			'two-blocks-interchange',
			this._getDimensionsClass(isMobile),
			this._getVisibilityClass(hidden)

		].join(" ").trim();

	}

	_getDimensionsClass(isMobile) {

		return (isMobile ? 'fill-container': '');

	}

	_getVisibilityClass(hidden) {

		return (hidden ? 'offscreen' : '');

	}

	render() {

		const { hidden, isMobile } = this.props; 

		return (
			
			<div className={ this._getContainerClass(isMobile, hidden) }>
				<TwoBlocksPrompt />
				<TwoBlocksSubmitter />
				<TwoBlocksReplayButton />
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
	prompt: React.PropTypes.object, 
	promptTransition: React.PropTypes.string
}; 

export default connect(mapStateToProps)(TwoBlocksInterchange); 
