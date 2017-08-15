import { createPromiseTimeout } from '../../utils/utils';

export default class TransitionBlocker {

	constructor() {
	
		this._currentTransitionBlocker = null;
		
	}

	_getBlockingProcess(conditionBlock, minimumBlockLength) {

		return minimumBlockLength 
			
			? Promise.all([ conditionBlock, createPromiseTimeout(minimumBlockLength) ]) 
			
			: conditionBlock;

	}

	/*----------  Public API  ----------*/

	checkBlockingCondition(props) {

		if (!(this._currentTransitionBlocker)) return;

		const { condition, resolve } = this._currentTransitionBlocker;

		if (condition(props)) {

			this._currentTransitionBlocker = null;
			
			resolve();


		}

	}

	createBlockingCondition(condition, minimumBlockLength) {

		const conditionBlock = new Promise((resolve, reject) => {

			this._currentTransitionBlocker = {

				condition,
				resolve, 
				reject

			};

		});

		return this._getBlockingProcess(conditionBlock, minimumBlockLength);

	}

}
