import Geometry from './Geometry'; 
import LatLng from './LatLng'; 

const Feature = function Feature(json) {

	this.json = json; 
	this.geometry = null; 

	this._createGeometryInstances(); 

}; 

Feature.prototype = {

	_createGeometryInstances() {

		const geometry = this.getGeometry(); 

		geometry.arr = geometry.arr.map(polygonArr => {

			const polygon = new Geometry('Polygon', polygonArr); 

			polygon.arr = polygon.arr.map(linearRingArr => {

				const linearRing = new Geometry('LinearRing', linearRingArr); 

				linearRing.arr = linearRing.arr.map(latLngArr => {

					return new LatLng(latLngArr); 

				}); 

				return linearRing; 

			});

			return polygon; 

		}); 

	}, 

	getGeometry() {

		if (this.geometry) return this.geometry; 

		if (!('geometry' in this.json)) return; 

		const { type, coordinates } = this.json.geometry; 

		this.geometry = new Geometry(type, coordinates);

		return this.geometry;   

	}, 

	getJSON() {

		return this.json; 

	}, 

	getProperty(prop) {

		if (!('properties' in this.json)) return; 

		return this.json.properties[prop]; 

	}

}; 

export default Feature; 
