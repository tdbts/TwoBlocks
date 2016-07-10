/* global document, google */
  
import showChooseLocationMap from './showChooseLocationMap';   
import { NYC_BOUNDARIES_DATASET_URL } from './constants/constants'; 
// import { createStore } from 'redux'; 

/*=================================
=            twoBlocks()          =
=================================*/

const twoBlocks = function twoBlocks(gameComponents) {

	/*----------  Configure Redux Store  ----------*/
	
	// const configureStore = function configureStore(reducer, initialState) {

	// 	const store = createStore(
	// 		reducer, 
	// 		initialState, 
	// 		window.devToolsExtension ? window.devToolsExtension() : undefined
	// 	);

	// 	return store; 
	// }; 

	const { canvas, locationData, panorama, spinner } = gameComponents; 

		panorama.setVisible(true); 

		spinner.start(); 

		spinner.once('revolution', () => {
		
			spinner.stop(); 

			const gps = new google.maps.LatLng(locationData.CENTER.lat, locationData.CENTER.lng); 

			const mapOptions = {
				center: gps
			}; 

			const chooseLocationMap = showChooseLocationMap(canvas, mapOptions);

			// Outside the polygon boundaries, in the Atlantic Ocean 
			const { lat: markerLat, lng: markerLng } = locationData.MARKER_PLACEMENT; 

			const markerOptions = {
				animation: google.maps.Animation.BOUNCE, 
				draggable: true, 
				map: chooseLocationMap, 
				position: new google.maps.LatLng(markerLat, markerLng)
			}; 

			const chooseLocationMarker = new google.maps.Marker(markerOptions); 

			google.maps.event.addListener(chooseLocationMarker, 'dragstart', () => chooseLocationMarker.setAnimation(null)); 

			google.maps.event.addListener(chooseLocationMap, 'click', e => {

				const { latLng } = e; 

				chooseLocationMarker.setPosition(latLng); 
				chooseLocationMarker.setAnimation(null); 

			});

			const calculateDistanceBetweenLatLngs = function calculateDistanceBetweenLatLngs(first, second) {
			
				return google.maps.geometry.spherical.computeDistanceBetween(first, second); 	
			
			};

			const convertMetersToMiles = function convertMetersToMiles(meters) {
			
				const MILES_PER_METER = 0.000621371; 

				return meters * MILES_PER_METER; 
			
			}; 

			google.maps.event.addListener(chooseLocationMarker, 'dragend', () => {
			
				const distanceFromPanoramaInMeters = calculateDistanceBetweenLatLngs(panorama.getPosition(), chooseLocationMarker.getPosition());

				const distanceFromPanoramaInMiles = convertMetersToMiles(distanceFromPanoramaInMeters).toFixed(3);  

				window.console.log("distanceFromPanoramaInMiles:", distanceFromPanoramaInMiles); 

			}); 

			google.maps.event.addListener(chooseLocationMap, 'click', () => {

				const distanceFromPanoramaInMeters = calculateDistanceBetweenLatLngs(panorama.getPosition(), chooseLocationMarker.getPosition()); 

				const distanceFromPanoramaInMiles = convertMetersToMiles(distanceFromPanoramaInMeters).toFixed(3); 

				window.console.log("distanceFromPanoramaInMiles:", distanceFromPanoramaInMiles);  

			}); 

			// Each borough is a feature 
			chooseLocationMap.data.loadGeoJson(NYC_BOUNDARIES_DATASET_URL); 

			chooseLocationMap.data.addListener('mouseover', event => {
				
				chooseLocationMap.data.revertStyle(); 
				
				chooseLocationMap.data.overrideStyle(event.feature, {
					fillColor: "#A8FFFC"
				}); 
			
			}); 

			chooseLocationMap.data.addListener('mouseout', () => chooseLocationMap.data.revertStyle()); 

		});  

}; 

/*=====  End of twoBlocks()  ======*/


export default twoBlocks; 
