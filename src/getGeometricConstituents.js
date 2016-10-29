import turf from '@turf/turf'; 
import normalizeLinearRings from './normalizeLinearRings'; 

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

const typeToMethodMap = {
	'MultiPolygon': 'multipolygon', 
	'Polygon': 'polygon'
}; 

const getGeometricConstituents = (desiredType, feature) => {

	if (Array.isArray(feature)) {

		const method = typeToMethodMap[desiredType]; 

		feature = turf[method](feature); 

	}

	let result = null; 

	if ((desiredType === feature.type) || (desiredType === feature.geometry.type)) {

		result = feature.coordinates || feature.geometry.coordinates; 

	}

	return result; 

}; 

export default getGeometricConstituents; 
