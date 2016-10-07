/**
 *
 * @param desiredType - String 
 * @param geometry - MultiPolygon | Polygon | LinearRing 
 *
 * @desc Returns an array of the geometry's constituent 
 *     parts, e.g. MultiPolygon --> Polygon(s), 
 *     Polygon --> LinearRing(s) 
 *
 */

const getGeometricConstituents = (desiredType, geometry) => {

	let result = null; 

	if (desiredType === geometry.getType()) {

		result = geometry.getArray(); 

	}

	return result; 

}; 

export default getGeometricConstituents; 
