/* global google */

/*======================================
=            createPanorama()          =
======================================*/

const createPanorama = function createPanorama(canvas, options = {}) {

	const defaultOptions = {
		position: null, 
		// Address control shows a box with basic information about the 
		// location, as well as a link to see the map on Google Maps 
		addressControl: false,
		addressControlOptions: { position: google.maps.ControlPosition.TOP_LEFT },
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
		mode: "webgl",
		// Pan Control shows a UI element that allows you to rotate the pano 
		panControl: false,
		panControlOptions: { position: google.maps.ControlPosition.TOP_LEFT },
		pano: null,
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
			position: google.maps.ControlPosition.TOP_LEFT, 
			style: google.maps.ZoomControlStyle.DEFAULT
		}
	};		

	const panoramaOptions = Object.assign({}, defaultOptions, options); 	

	// Documentation on streetViewPanorama class: 
	// https://developers.google.com/maps/documentation/javascript/reference#StreetViewPanorama
	return new google.maps.StreetViewPanorama(canvas, 
		panoramaOptions); 
};

/*=====  End of createPanorama()  ======*/


export default createPanorama; 
