import React from 'react';
import { connect } from 'react-redux';
import { lifecycle, transitionTypes } from '../../constants/constants';
import mapStateToProps from './mapStateToProps';
import mapDispatchToProps from './mapDispatchToProps';
import Content from './Content';
import Display from './Display';
import Timing from './Timing';
import TransitionBlocker from './TransitionBlocker';

class TwoBlocksPrompt extends React.Component {

	constructor(props) {

		super(props);

		this.state = {

			currentPrompt: Promise.resolve(),
			promptTransition: ''
		
		};

		this.promptTypes = {

			CORRECT_BOROUGH: 'correct-borough-prompt',
			ERROR: 'error-prompt',
			GUESSING_LOCATION: 'guessing-location-prompt', 
			INCORRECT_BOROUGH: 'incorrect-borough-prompt',
			LOADING_PANORAMA: 'loading-panorama-prompt', 
			POSTGAME: 'game-over-prompt', 
			PREGAME: 'pregame-prompt', 
			RESTART: 'restart-prompt', 
			SHOWING_PANORAMA: 'showing-panorama-prompt', 
			TURN_COMPLETE: 'turn-complete-prompt'			
		
		};

		this.transitionTypes = transitionTypes;

		this._promisifySetState();

		this.blocker = new TransitionBlocker();
		this.content = new Content(this);
		this.display = new Display(this);
		this.timing = new Timing(this);

	}

	componentDidUpdate(prevProps, prevState) {

		this._checkCurrentPrompt(prevState.currentPrompt);
		
		this._checkGameStage(prevProps.stage);

		this._checkPromptDisplaying(prevProps.prompt.displaying);

		this.blocker.checkBlockingCondition(this.props);

	}

	shouldComponentUpdate(nextProps) {

		// No need to update if the prompt has already done its job.
		return lifecycle.AFTER !== nextProps.prompt.displaying;

	}

	_canDisplayPrompt(prevDisplaying) {

		const { displaying } = this.props.prompt;

		return (prevDisplaying !== displaying) 

			&& (lifecycle.DURING === displaying);

	}

	_checkCurrentPrompt(prevCurrentPrompt) {

		if (prevCurrentPrompt === this.state.currentPrompt) return;

		this.state.currentPrompt.then(() => this.props.stopShowingPrompt());

	}

	_checkGameStage(prevStage) {

		// Ensure something changed
		if (prevStage === this.props.stage) return;
	
		this.props.showPrompt();

	}

	_checkPromptDisplaying(prevDisplaying) {

		// Ensure change occured
		if (!(this._canDisplayPrompt(prevDisplaying))) return;

		const currentPrompt = this._displayPrompt();

		this.setState({ currentPrompt });

	}

	_displayPrompt() {

		const timing = this.timing.getForStage(this.props.stage);

		return this.display.start(timing);

	}

	_getContainerClassList() {

		return [

			"two-blocks-interchange-component",
			"two-blocks-prompt",
			this._getVisibilityClass()

		].join(" ").trim();

	}

	_getPromptContent() {

		return this.content.getForProps(this.props);

	}

	_getTextClassList() {

		const { promptTransition } = this.state;

		const list = [

			"prompt-text"

		];

		if (promptTransition) {

			list.push(promptTransition);

		}

		return list.join(" ").trim();

	}

	_getVisibilityClass() {

		const { displaying } = this.props.prompt;

		const isVisible = (lifecycle.DURING === displaying);

		return isVisible ? '' : 'offscreen';

	}

	_promisifySetState() {

		/*----------  Save reference to original setState() method  ----------*/
		
		this._superSetState = this.setState.bind(this); 

		/*----------  Override setState() to be promisified  ----------*/
		
		return nextState => {

			return new Promise(resolve => {

				this._superSetState(nextState, resolve); 

			}); 

		}; 

	}

	render() {

		return (

			<div className={ this._getContainerClassList() }>
				<div className={ this._getTextClassList() }>
					{ this._getPromptContent() }
				</div>
			</div>			

		);

	}

}

export default connect(mapStateToProps, mapDispatchToProps)(TwoBlocksPrompt);
