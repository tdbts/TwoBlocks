import Panorama from './Panorama';
import Countdown from '../components/component-utils/Countdown';  // TODO: move location
import { STREETVIEW_COUNTDOWN_LENGTH } from '../constants/constants';

/*----------  Constructor  ----------*/

const PanoramaMobile = function PanoramaMobile(element, options) {

	Panorama.call(this, element, options);

	this.events = Object.assign({}, this.events, {
		
		COUNTDOWN_END: 'COUNTDOWN_END',
		COUNTDOWN_START: 'COUNTDOWN_START',
		COUNTDOWN_TICK: 'COUNTDOWN_TICK' 
	
	});

	this._countdown = null;
	
};

/*----------  Inherit from Panorama  ----------*/

PanoramaMobile.prototype = Object.create(Panorama.prototype);

/*----------  Assign Constructor  ----------*/

PanoramaMobile.prototype.constructor = PanoramaMobile;

/*----------  Define methods  ----------*/

const panoramaMobileMethods = {
	
	_listenForCountdownEvents() {

		this._countdown.once(this._countdown.events.START, () => this.emit(this.events.COUNTDOWN_START, this._countdown.timeLeft()));

		this._countdown.on(this._countdown.events.TICK, () => this.emit(this.events.COUNTDOWN_TICK, this._countdown.timeLeft()));

		this._countdown.once(this._countdown.events.END, () => {

			this.emit(this.events.COUNTDOWN_END);
			this.emit(this.events.DISPLAY_STOP);
			
		});
	
	}, 

	/*----------  Public API  ----------*/
	
	display() {

		this._countdown = new Countdown(STREETVIEW_COUNTDOWN_LENGTH);

		this._listenForCountdownEvents(this._countdown);

		this._countdown.start();

		this.emit(this.events.DISPLAY_START);

	}

};

/*----------  Assign methods to prototype  ----------*/

for (const method in panoramaMobileMethods) {
	
	PanoramaMobile.prototype[method] = panoramaMobileMethods[method];

}

/*----------  Export  ----------*/

export default PanoramaMobile;
