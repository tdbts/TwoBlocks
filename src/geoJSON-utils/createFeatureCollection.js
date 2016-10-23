import Feature from './Feature'; 

const createFeatureCollection = function createFeatureCollection(featureCollectionJSON) {

	if (!('features' in featureCollectionJSON)) return; 

	return featureCollectionJSON.features.map(featureJSON => new Feature(featureJSON)); 

}; 

export default createFeatureCollection; 
