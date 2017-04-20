/* global google */

import { EventEmitter } from 'events';
import WebGLManager from './WebGLManager';
import removeStreetNameAnnotations from '../components/component-utils/removeStreetNameAnnotations';  // TODO: Move location

/*----------  Constructor  ----------*/

const Panorama = function Panorama(element, options) {

	// Call superclass
	EventEmitter.call(this);

	this._borough = null;
	this._element = element;
	this._displaying = false;
	this.options = this._normalizeOptions(options);
	// Documentation on streetViewPanorama class: 
	// https://developers.google.com/maps/documentation/javascript/reference#StreetViewPanorama
	this._latLng = null;
	this._panorama = new google.maps.StreetViewPanorama(element, 
			this.options); 
	
	this.events = {
		DISPLAY_START: 'DISPLAY_START',
		DISPLAY_STOP: 'DISPLAY_STOP'
	};

	this._listenForDisplays();
	this._listenForPanoChanges();
	
};

/*----------  Inherit from EventEmitter() class  ----------*/

Panorama.prototype = Object.create(EventEmitter.prototype);

/*----------  Define Constructor  ----------*/

Panorama.prototype.constructor = Panorama;

/*----------  Define methods  ----------*/

const panoramaMethods = {
	
	_getGraphicsMode() {

		const webGLManager = new WebGLManager(this.el());

		if (webGLManager.canUseWebGl()) {

			setTimeout(() => webGLManager.initGl(), 1000);
		
		}		

		return webGLManager.canUseWebGl() ? "webgl" : "html5";

	}, 

	_listenForDisplays() {

		this.on(this.events.DISPLAY_START, () => {

			this._displaying = true;

		});
		
		this.on(this.events.DISPLAY_STOP, () => {

			this._displaying = false;
		
		});

	}, 

	_listenForPanoChanges() {

		google.maps.event.addListener(this._panorama, 'pano_changed', () => removeStreetNameAnnotations(this._panorama)); 		

	},

	_normalizeOptions(options) {

		return Object.assign({}, getOptions.call(this), options);

	},

	/*----------  Public API  ----------*/
	
	// Implemented by subclasses
	display() {},

	el() {

		return this._element;

	},

	getBorough() {

		return this._borough;

	},

	getGooglePanorama() {

		return this._panorama;

	},

	getPosition() {

		return this._latLng;

	}, 

	isDisplaying() {

		return this._displaying;

	},

	setBorough(borough) {

		if (!(borough)) return;

		this._borough = borough;

	},

	setPosition(latLng) {

		if (!(latLng)) return;

		this._latLng = latLng;

		this._panorama.setPosition(latLng);

	},

	setOptions(options) {

		if (!(this._panorama)) return;

		this._panorama.setOptions(options);

	}

};

/*----------  Helper Functions  ----------*/

const getOptions = function getOptions() {

	const position = google.maps.ControlPosition.TOP_LEFT;

	return {
		position: null, 
		// Address control shows a box with basic information about the 
		// location, as well as a link to see the map on Google Maps 
		addressControl: false,
		addressControlOptions: { position },
		// clickToGo shows a rectangular "highlight" under the cursor, and on 
		// click, the street view moves to the location clicked upon.  We will 
		// want to keep this disabled for the game.			
		clickToGo: false,
		disableDoubleClickZoom: true,
		// Below, we add an event listener to 'closeclick', which fires when 
		// the close button is clicked.  In the original author's implementation, 
		// the application reveals the map on 'closeclick'.  			
		enableCloseButton: false,
		imageDateControl: false,
		linksControl: false,
		mode: this._getGraphicsMode(),
		// Pan Control shows a UI element that allows you to rotate the pano 
		panControl: false,
		panControlOptions: { position },
		pano: null,  // ID of panorama to use 
		pov: {
			zoom: 1.1,		
			heading: 0,
			pitch: 0
		},
		scrollwheel: false,
		visible: true,
		// Zoom control functionality is obvious 
		zoomControl: false,
		zoomControlOptions: {
			position, 
			style: google.maps.ZoomControlStyle.DEFAULT
		}
	};	

}; 

/*----------  Assign methods to prototype  ----------*/

for (const method in panoramaMethods) {
	
	Panorama.prototype[method] = panoramaMethods[method];

}

/*----------  Export  ----------*/

export default Panorama;
