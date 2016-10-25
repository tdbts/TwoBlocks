import turf from '@turf/turf'; 
import getLatLngMaxMin from './getLatLngMaxMin';  
import getRandomFeature from './getRandomFeature'; 
import selectRandomWeightedLinearRing from './selectRandomWeightedLinearRing';
import getLatLngWithinBoundaries from './getLatLngWithinBoundaries'; 

const RandomLocationGenerator = function RandomLocationGenerator(featureCollection) {

	this.featureCollection = featureCollection; 	

	this.latLngMaxMin = null;; 
	this.selectedBorough = null;
	this.selectedLinearRing = null;  

	this._processFeatureCollection(); 

}; 

/*----------  Define Prototype  ----------*/

RandomLocationGenerator.prototype = {

	_processFeatureCollection() {

		// Randomly selected one of the five boroughs 
		this.selectedBorough = getRandomFeature(this.featureCollection); 

		// Selected one of the linear rings which describe the borough 
		// geography, weighed according to the size of the linear rings 
		this.selectedLinearRing = selectRandomWeightedLinearRing(this.selectedBorough); 

		// Construct an object that descries the max / min values 
		// for lat / lng, within the selected linear ring 
		this.latLngMaxMin = getLatLngMaxMin(this.selectedLinearRing); 

		// Create a GeoJSON polygon out of the selected linear ring 
		this.polygon = turf.polygon([this.selectedLinearRing]); 

		// Switch coordinate arrays so that order is latitude, longitude 
		this.polygon.geometry.coordinates[0] = this.polygon.geometry.coordinates[0].map(coords => [coords[1], coords[0]]); 

	} , 

	/*----------  Public API  ----------*/
	
	randomLatLng() {

		return getLatLngWithinBoundaries(this.latLngMaxMin, this.polygon); 

	}

}; 

export default RandomLocationGenerator; 
