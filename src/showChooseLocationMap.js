/* global google */

const DEFAULT_LAT = 40.6291566; 
const DEFAULT_LNG = -74.0287341; 

const showChooseLocationMap = function showChooseLocationMap(canvas, locationLatLngs, options) {

	const defaultOptions = {
		center: new google.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG), 
		mapTypeControl: false, 
		mapTypeId: google.maps.MapTypeId.ROADMAP, 
		streetViewControl: false, 
		zoom: 10
	}; 

	const mapOptions = Object.assign({}, defaultOptions, options); 
	const map = new google.maps.Map(canvas, mapOptions); 

	const worldCoordinates = [
		new google.maps.LatLng(0, -90),
		new google.maps.LatLng(0, 90),
		new google.maps.LatLng(90, -90),
		new google.maps.LatLng(90, 90)
	]; 

	const centerOfTheWorld = new google.maps.Polygon({

		paths: [worldCoordinates, locationLatLngs],
		strokeColor: '#000000',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#000000',
		fillOpacity: 0.35							
	
	}); 	

	centerOfTheWorld.setMap(map); 

}; 

export default showChooseLocationMap; 
