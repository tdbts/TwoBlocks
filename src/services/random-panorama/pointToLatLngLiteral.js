const pointToLatLngLiteral = function pointToLatLngLiteral(point) {

	const { geometry } = point; 

	if (!(geometry)) {

		onError(); 

	}

	const { coordinates } = geometry; 

	if (!(coordinates)) {

		onError(); 

	}

	// const [ lat, lng ] = coordinates;
	const [ lng, lat ] = coordinates;  

	return { lat, lng }; 

}; 

const onError = function onError() {

	throw new Error("pointToLatLngLiteral(): Unexpected entity passed as point."); 

}; 

export default pointToLatLngLiteral; 
