/* global document */

const injectGapiScript = function injectGapiScript(MAPS_API_KEY) {
	
	window.console.log('Injecting GAPI script.'); 

	return new Promise(resolve => {

		const script = document.createElement("script");
		 
		let source = "https://maps.googleapis.com/maps/api/js"; 	
		
		script.type = "text/javascript";
		
		if (MAPS_API_KEY) {
			
			source += `?key=${MAPS_API_KEY}`;
		
		}

		window.console.log("source:", source); 
		
		script.src = source; 
		script.onload = resolve; 

		document.body.appendChild(script);

	}); 

};

export default injectGapiScript; 
