const getRandomFeature = featureCollection => {

	const randomIndex = Math.floor(Math.random() * featureCollection.length); 

	return featureCollection[randomIndex]; 
	
}; 

export default getRandomFeature; 
