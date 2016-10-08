const createFeatureCollection = function createFeatureCollection(featureCollectionJSON) {

	if (!('features' in featureCollectionJSON)) return; 

	return featureCollectionJSON.features.map(featureJSON => new Feature(featureJSON)); 

}; 

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

			})

			return polygon; 

		}); 

	}, 

	getGeometry() {

		if (this.geometry) return this.geometry; 

		if (!('geometry') in this.json) return; 

		const { type, coordinates } = this.json.geometry; 

		this.geometry = new Geometry(type, coordinates);

		return this.geometry;   

	}, 

	getProperty(prop) {

		if (!('properties' in this.json)) return; 

		return this.json.properties[prop]; 

	}

}; 


const Geometry = function Geometry(type, arr) {

	this.type = type; 
	this.arr = arr; 

}; 

Geometry.prototype = {

	getArray() {

		return this.arr; 
		
	}, 


	getLength() {

		return this.arr.length; 

	}, 

	getType() {

		return this.type; 

	}

}; 


const LatLng = function LatLng(coords) {

	this.coords = coords; 

}; 

LatLng.prototype = {

	lat() {

		return this.coords[0]; 

	}, 

	lng() {

		return this.coords[1]; 

	}

}; 

export default createFeatureCollection; 
