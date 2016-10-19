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

export default LatLng; 
