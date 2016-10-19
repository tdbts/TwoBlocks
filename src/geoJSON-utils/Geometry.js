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

export default Geometry; 
