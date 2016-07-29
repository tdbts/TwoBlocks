const getBoroughFromFeatureCollection = function getBoroughFromFeatureCollection(featureCollection, boroughName) {

	if (!(featureCollection) || !(boroughName)) return; 

	return featureCollection.filter(feature => boroughName.toLowerCase() === feature.getProperty('boro_name').toLowerCase()).pop(); 

}; 

export default getBoroughFromFeatureCollection; 
