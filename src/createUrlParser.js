/*=======================================
=            createUrlParser()            =
=======================================*/

const createUrlParser = function createUrlParser(url) {

	let parameters = null; 

	return {

		getParameters() {
			
			// If parameters is already defined, don't parse the 
			// URL again.  Encourage the caller to create a new 
			// url parser.    
			if (parameters) return; 

			// The original author of this code was not very experienced with Javascript.  
			// I changed 'parameters' (originally 'vars') from an array to 
			// an object to make it appropriate for how the author has used it.  
			parameters = {};

			// Get the string of everything after the '?' in the url, 
			// and split it into an array of parameter key/value pairs 
			const hashes = url.slice(url.indexOf('?') + 1).split('&');

			// For each parameter key/value pair, split the pair at the '=' 
			// character and add the key / value pair to the 'parameters' object  
			hashes.forEach(hash => {
			
				hash = hash.split('='); 

				const [ prop, val ] = hash; 

				parameters[prop] = val; 
			
			}); 

			return parameters;
		}, 

		getParameterValue(paramName) {

			if (!(parameters)) return; 

			return parameters[paramName]; 

		}

	}; 

};

/*=====  End of createUrlParser()  ======*/


export default createUrlParser; 
