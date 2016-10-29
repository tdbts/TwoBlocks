import requestNearestPanorama from './requestNearestPanorama';  
import pointToLatLngLiteral from './pointToLatLngLiteral'; 
import RandomLocationGenerator from './RandomLocationGenerator'; 
import { tryAtMost } from './utils/utils';
import { MAXIMUM_PANORAMA_REQUESTS } from './constants/constants';  

const getRandomPanoramaLocation = function getRandomPanoramaLocation(featureCollection) {

	const generator = new RandomLocationGenerator(featureCollection); 

	const selectedBorough = generator.selectedBorough; 

	const boroughName = selectedBorough.properties.boro_name; 

	let randomLatLng = generator.randomLatLng(); 

	return tryAtMost(() => requestNearestPanorama(randomLatLng), MAXIMUM_PANORAMA_REQUESTS, (panoRequestResults, requestAttemptsLeft) => {
		
		window.console.log('onCaught()'); 
		
		const { panoData, status } = panoRequestResults; 

		window.console.log("panoData:", panoData); 
		window.console.log("status:", status); 
		window.console.log("requestAttemptsLeft:", requestAttemptsLeft);

		randomLatLng = generator.randomLatLng();  

	})

	.then(() => window.console.log("randomLatLng:", randomLatLng))

	.then(() => (randomLatLng = (pointToLatLngLiteral(randomLatLng))))

	// N.B - Parentheses must be wrapped around an object literal 
	// returned by an arrow function
	.then(() => ( { boroughName, randomLatLng, selectedBorough } ));	

}; 

export default getRandomPanoramaLocation; 
