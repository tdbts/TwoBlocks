/* global document */

/*----------  Constants  ----------*/

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.0.1/dist/leaflet.css"; 

const LEAFLET_API = "https://unpkg.com/leaflet@1.0.1/dist/leaflet.js"; 

/*----------  loadLeaflet()  ----------*/

let loadPromise = null; 

const loadLeaflet = function loadLeaflet() {

	if (!(loadPromise)) {  // Load Leaflet library only once 

		loadPromise = new Promise(resolve => {

			const styling = document.createElement('link'); 

			styling.rel = "stylesheet";
			styling.href = LEAFLET_CSS; 

			document.head.appendChild(styling); 

			const api = document.createElement('script'); 

			api.addEventListener('load', resolve, { once: true }); 

			api.type = "text/javascript"; 
			api.src = LEAFLET_API; 

			document.body.appendChild(api); 

		}); 

	}  

	return loadPromise; 

}; 

/*----------  Export  ----------*/

export default loadLeaflet; 
