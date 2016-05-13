/* global document, google */

/*======================================
=            goToFullscreen()          =
======================================*/

/**
 *
 * N.B. - This script seems to assume either webkit- or moz-.  
 *     I may want to incorporate that launchFullscreen() 
 *     function by David Walsch.  
 *     
 *     Never invoked in the original script.
 *
 */

const goToFullscreen = function goToFullscreen(canvas) {

	// 'canvas' should be passed into this function 
	// var canvas = document.getElementById("canvas_streetviewpanorama");

	if (document.webkitCancelFullScreen) {

		canvas.webkitRequestFullScreen();

		fullscreenWidth = canvas.clientWidth;
		fullscreenHeight = canvas.clientHeight;

		canvas.style.width = "100%";
		canvas.style.height = "100%";

		document.addEventListener("webkitfullscreenchange", function () {

			if (!(document.webkitIsFullScreen)) {
				
				// var c = document.getElementById("canvas_streetviewpanorama");
				
				canvas.style.width = fullscreenWidth + "px";
				canvas.style.height = fullscreenHeight + "px";
			
			}

		}, false);

	} else if (document.mozCancelFullScreen) {
		
		console.log("moz");
		
		canvas.mozRequestFullScreen();
		
		fullscreenWidth = canvas.clientWidth;
		fullscreenHeight = canvas.clientHeight;
		
		canvas.style.width = "100%";
		canvas.style.height = "100%";
		
		document.addEventListener("mozfullscreenchange", function () {
		
			if (document.mozFullScreenElement === null) {
		
				// var c = document.getElementById("canvas_streetviewpanorama");
		
				canvas.style.width = fullscreenWidth + "px";
				canvas.style.height = fullscreenHeight + "px";
		
				google.maps.event.trigger(panorama, 'resize')
			}
		
		}, false);
	}
}

/*=====  End of goToFullscreen()  ======*/


module.exports = goToFullscreen; 
