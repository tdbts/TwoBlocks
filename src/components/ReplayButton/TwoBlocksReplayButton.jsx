/* global window */

import React from 'react';
import { connect } from 'react-redux';
import { gameStages } from '../../constants/constants';
import mapStateToProps from './mapStateToProps';
import mapDispatchToProps from './mapDispatchToProps';

export default class TwoBlocksReplayButton extends React.Component {

	constructor(props) {

		super(props);

	}

	componentDidMount() {
		
		window.addEventListener('keydown', e => this._onKeyDown(e));

	}

	_onKeyDown(e) {

		const { restarting, stage, onButtonClick } = this.props;

		if ((gameStages.POSTGAME !== stage) || ('Enter' !== e.key) || restarting) return;
		
		// Treat enter press while replay button visible as 
		// command to restart game
		onButtonClick();

	}

	_getClassName(hidden) {

		return [

			"two-blocks-button", 
			"two-blocks-replay-button", 
			hidden ? "hidden" : ""

		].join(" ").trim(); 

	}

	render() {

		const text = "Play again?";

		const { hidden, onButtonClick } = this.props; 

		const calculatedClassName = this._getClassName(hidden);

		const onClick = hidden ? null : onButtonClick;

		return (

			<button className={ calculatedClassName } onClick={ onClick }>{ text }</button>

		);

	}

}

/*----------  Component  ----------*/

// const TwoBlocksReplayButton = function TwoBlocksReplayButton(props) { 

// 	const text = "Play again?";

// 	const { hidden, onButtonClick } = props; 

// 	const calculatedClassName = getClassName(hidden);

// 	const onClick = hidden ? null : onButtonClick;

// 	return (
// 		<button className={ calculatedClassName } onClick={ onClick }>{ text }</button>
// 	);
	
// }; 

// /*----------  Helper Functions  ----------*/

// const getClassName = function getClassName(hidden) {

// 	return [

// 		"two-blocks-button", 
// 		"two-blocks-replay-button", 
// 		hidden ? "hidden" : ""

// 	].join(" ").trim(); 

// }; 

/*----------  Define PropTypes  ----------*/

TwoBlocksReplayButton.propTypes = {
	
	hidden: React.PropTypes.bool.isRequired, 
	onButtonClick: React.PropTypes.func.isRequired

}; 

/*----------  Export  ----------*/

export default connect(mapStateToProps, mapDispatchToProps)(TwoBlocksReplayButton); 
