const getIndexOfBoroughFromFeatureCollection(featureCollection, boroughName) {

	if (!(featureCollection) || !(boroughName)) return; 

	return featureCollection.reduce((prev, curr, currIndex) => {  // eslint-disable-line no-unused-vars

		if (boroughName.toLowerCase() !== curr.getProperty('boro_name').toLowerCase()) return null; 

		return currIndex; 

	}); 

}; 

export default getIndexOfBoroughFromFeatureCollection; 
