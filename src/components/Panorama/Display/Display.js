import { EventEmitter } from 'events';
import Spinner from './Spinner';
import Countdown from './Countdown';

export default class PanoramaDisplay extends EventEmitter {

	constructor(panorama, isMobile) {

		super();

		this.COUNTDOWN_LENGTH = 1;
		// this.COUNTDOWN_LENGTH = 15;

		this.SPINNER_OPTIONS = {
			punctuate: {
				segments: 4, 
				delay: 2000
			}		
		};

		this.events = {

			COUNTDOWN_END: 'COUNTDOWN_END',
			COUNTDOWN_START: 'COUNTDOWN_START',
			COUNTDOWN_TICK: 'COUNTDOWN_TICK',
			DISPLAY_START: 'DISPLAY_START',
			DISPLAY_STOP: 'DISPLAY_STOP'
		
		};

		this._isDisplaying = false;
		this._isMobile = isMobile;
		this._panorama = panorama;

		this._countdown = null;
		this._spinner = null;

	}

	_listenForCountdownEvents() {

		this._countdown.once(this._countdown.events.START, () => this.emit(this.events.COUNTDOWN_START, this._countdown.timeLeft()));

		this._countdown.on(this._countdown.events.TICK, () => this.emit(this.events.COUNTDOWN_TICK, this._countdown.timeLeft()));

		this._countdown.once(this._countdown.events.END, () => {

			this.emit(this.events.COUNTDOWN_END);
			this.emit(this.events.DISPLAY_STOP);
			
		});
	
	}

	_onSpinnerRevolution() {

		this._spinner.stop();

		this.emit(this.events.DISPLAY_STOP);

	}

	_startDesktopDisplay() {

		this._spinner = new Spinner(this._panorama, this.SPINNER_OPTIONS);

		this._spinner.once(this._spinner.events.REVOLUTION, () => this._onSpinnerRevolution());

		this._spinner.start();

	}

	_startMobileDisplay() {

		this._countdown = new Countdown(this.COUNTDOWN_LENGTH);

		this._listenForCountdownEvents();

		this._countdown.start();

	}

	/*----------  Public API  ----------*/
	
	start() {

		if (this._isDisplaying) return;

		if (this._isMobile) {

			this._startMobileDisplay();

		} else {

			this._startDesktopDisplay();

		}

		this.emit(this.events.DISPLAY_START);		

	}

	stop() {

		if (!(this._isDisplaying)) return;

		if (this._isMobile) {

			this._countdown.stop();

		} else {

			this._spinner.stop();

		}

		this.emit(this.events.DISPLAY_STOP);

	}

}
