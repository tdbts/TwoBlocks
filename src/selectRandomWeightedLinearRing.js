import getGeometricConstituents from './getGeometricConstituents'; 
import sortLeastToGreatest from './sortLeastToGreatest'; 
import playoff from './playoff'; 
import headToHeadMatchups from './headToHeadMatchups'; 
import weightedRandomSelection from './weightedRandomSelection'; 

const selectRandomWeightedLinearRing = function selectRandomWeightedLinearRing(feature) {

	const polygonCollection = getGeometricConstituents('MultiPolygon', feature.geometry); 

	const linearRingCollection = polygonCollection

		.map(polygon => getGeometricConstituents('Polygon', polygon))

		.map(linearRings => linearRings[0]); 
	 
	const linearRingPathLengths = linearRingCollection.map(linearRing => {

		return linearRing.length;

	}); 
	
	// Create map for quick lookup later 
	const linearRingLengthMap = linearRingCollection.reduce((prev, curr) => {

		if (!(curr)) return prev; 

		prev[curr.length] = curr; 

		return prev; 

	}, {});  
	
	let sortedLinearRingPathLengths = sortLeastToGreatest(linearRingPathLengths.slice()); 

	// Drop smallest LinearRing 
	if ((sortedLinearRingPathLengths.length % 2) !== 0) {

		sortedLinearRingPathLengths = sortedLinearRingPathLengths.slice(1); 

	}

	const initializer = winners => sortLeastToGreatest(winners.slice()); 

	const playOneRound = players => headToHeadMatchups(players, weightedRandomSelection); 

	// Playoff returns an array of length 1 (winner)
	const lengthOfSelectedLinearRing = playoff(sortedLinearRingPathLengths, playOneRound, initializer)[0]; 

	const selectedLinearRing = linearRingLengthMap[lengthOfSelectedLinearRing];  

	return selectedLinearRing; 

}; 

export default selectRandomWeightedLinearRing; 
