import { createPromiseTimeout } from '../../utils/utils';

export default class PromptDisplay {

	constructor(prompt) {

		this._prompt = prompt;
		this._transitionTypes = prompt.transitionTypes;

	}

	// The 'delay' can be either a number or promise.  
	// If it is a number, return a promise timeout, 
	// otherwise, return the promise.
	_displayStage(delay) {

		let displayLength = null;

		if ('number' === typeof delay) {

			displayLength = createPromiseTimeout(delay);

		} else {

			displayLength = delay;

		}

		return displayLength;

	}

	/*----------  Public API  ----------*/

	start(timing) {

		const { LEAVING, SHOWING } = this._transitionTypes;

		const { 

			delay, 
			enter, 
			duration, 
			leave 

		} = timing;
 
		return this._displayStage(delay)

			.then(() => this._prompt.setState({ promptTransition: SHOWING }))

			.then(() => this._displayStage(enter))

			.then(() => this._displayStage(duration))

			.then(() => this._prompt.setState({ promptTransition: LEAVING }))

			.then(() => this._displayStage(leave))

			.then(() => this._prompt.setState({ promptTransition: '' }))

			.catch(e => {

				throw e;

			});

	}

}
