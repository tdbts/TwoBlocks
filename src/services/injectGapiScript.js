/* global document */

const GOOGLE_MAPS_API = "https://maps.googleapis.com/maps/api/js";

const injectGapiScript = function injectGapiScript(MAPS_API_KEY) {

	return new Promise((resolve, reject) => {

		const script = document.createElement("script");

		let source = GOOGLE_MAPS_API; 	
		
		script.type = "text/javascript";
		
		if (MAPS_API_KEY) {
			
			source += `?key=${MAPS_API_KEY}`;
		
		}
		
		script.src = source; 
		script.onload = resolve; 
		script.onerror = reject; 

		document.body.appendChild(script);

	}); 

};

export default injectGapiScript; 
