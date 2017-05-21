import Spinner from './Spinner';  // TODO: Resolve 
import Panorama from './Panorama';

/*----------  Constants  ----------*/

const SPINNER_OPTIONS = {
	punctuate: {
		segments: 4, 
		delay: 2000
	}		
};

/*----------  Constructor  ----------*/

const PanoramaDesktop = function PanoramaDesktop(element) {

	// Inherit from superclass
	Panorama.call(this, element);

	this._spinner = new Spinner(this.getGooglePanorama(), SPINNER_OPTIONS);
	
};

/*----------  Inherit from Panorama  ----------*/

PanoramaDesktop.prototype = Object.create(Panorama.prototype);

/*----------  Assign Constructor  ----------*/

PanoramaDesktop.prototype.constructor = PanoramaDesktop;

/*----------  Define methods  ----------*/

const panoramaDesktopMethods = {
	
	_onSpinnerRevolution() {

		this._spinner.stop();

		this.emit(this.events.DISPLAY_STOP);

	}, 

	/*----------  Public API  ----------*/
	
	display() {

		if (this.isDisplaying()) return;

		this._spinner.once(this._spinner.events.REVOLUTION, () => this._onSpinnerRevolution());

		this._spinner.start();

		this.emit(this.events.DISPLAY_START);

	}

};

/*----------  Assign methods to prototype  ----------*/

for (const method in panoramaDesktopMethods) {
	
	PanoramaDesktop.prototype[method] = panoramaDesktopMethods[method];

}

/*----------  Export  ----------*/

export default PanoramaDesktop;
