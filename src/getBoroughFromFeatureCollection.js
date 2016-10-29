const getBoroughFromFeatureCollection = function getBoroughFromFeatureCollection(featureCollection, boroughName) {

	if (!(featureCollection) || !(boroughName)) return; 

	return featureCollection.filter(feature => boroughName.toLowerCase() === feature.properties.boro_name.toLowerCase())[0]; 

}; 

export default getBoroughFromFeatureCollection; 
