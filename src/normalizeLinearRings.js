import normalizeLinearRing from './normalizeLinearRing'; 

const normalizeLinearRings = function normalizeLinearRings(polygon) {

	for (let i = 0; i < polygon.length; i++) {

		const ring = polygon[i]; 

		normalizeLinearRing(ring); 

	}

}; 

export default normalizeLinearRings; 
