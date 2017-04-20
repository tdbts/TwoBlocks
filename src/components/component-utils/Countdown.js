import { EventEmitter } from 'events'; 
import { inherits } from 'util'; 
import { isType } from '../../utils/utils';
import { MILLISECONDS_IN_A_SECOND } from '../../constants/constants'; 

const Countdown = function Countdown(countdownLength) {

	if (!(isType('number', countdownLength))) {

		throw new Error("The argument to a new Countdown instance must be a number."); 

	}

	if (countdownLength < 0) {

		throw new Error("The argument to a new Countdown instance must be a positive number."); 

	}

	this.events = {
		END: 'END',
		START: 'START',
		STOP: 'STOP',
		TICK: 'TICK'
	};

	this.countdownLength = countdownLength; 
	this.interval = null; 
	this.stopped = false; 

}; 

/*----------  Inherit EventEmitter Functionality  ----------*/

inherits(Countdown, EventEmitter); 

Object.assign(Countdown.prototype, {

	_nextTick() {
 
		if (this.stopped || this.countdownLength === 0) {

			if (!(this.interval)) return; 

			clearInterval(this.interval); 

		}

		this.countdownLength -= 1; 

		this.emit(this.events.TICK, this.countdownLength); 

		if (this.countdownLength === 0) {

			this.emit(this.events.END, 'end'); 

		}

	}, 

	timeLeft() {

		return this.countdownLength; 

	}, 

	start() {

		const interval = setInterval(() => this._nextTick(), MILLISECONDS_IN_A_SECOND); 
		
		this.interval = interval; 
	
		this.emit(this.events.START); 

	}, 

	stop() {

		this.stopped = true; 

		this.emit(this.events.STOP); 

	}

}); 

export default Countdown; 
