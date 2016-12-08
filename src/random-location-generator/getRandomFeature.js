const getRandomFeature = featureCollection => {

	const randomIndex = Math.floor(Math.random() * featureCollection.features.length); 

	return featureCollection.features[randomIndex]; 
	
}; 

export default getRandomFeature; 
