import getGeometricConstituents from './getGeometricConstituents'; 
import sortLeastToGreatest from './sortLeastToGreatest'; 
import playoff from './playoff'; 
import headToHeadMatchups from './headToHeadMatchups'; 
import weightedRandomSelection from './weightedRandomSelection'; 

const selectRandomWeightedLinearRing = function selectRandomWeightedLinearRing(feature) {

	const polygonCollection = getGeometricConstituents('MultiPolygon', feature.getGeometry()); 

	window.console.log("polygonCollection:", polygonCollection); 
	
	const linearRingCollection = polygonCollection

		.map(polygon => getGeometricConstituents('Polygon', polygon))

		// This assumes our polygons don't have any "holes" in them 
		.map(linearRings => linearRings.pop()); 

	window.console.log("linearRingCollection:", linearRingCollection); 	

	const linearRingPathLengths = linearRingCollection.map(linearRing => linearRing.getLength()); 

	window.console.log("linearRingPathLengths:", linearRingPathLengths); 

	// Create map for quick lookup later 
	const linearRingLengthMap = linearRingCollection.reduce((prev = {}, curr) => {

		prev[curr.getLength()] = curr; 

		return prev; 

	}); // Start with empty array 

	window.console.log("linearRingLengthMap:", linearRingLengthMap); 

	// return linearRingPathLengths; 

	let sortedLinearRingPathLengths = sortLeastToGreatest(linearRingPathLengths.slice()); 

	window.console.log("sortedLinearRingPathLengths:", sortedLinearRingPathLengths); 	

	// Drop smallest LinearRing 
	if ((sortedLinearRingPathLengths.length % 2) !== 0) {

		sortedLinearRingPathLengths = sortedLinearRingPathLengths.slice(1); 

	}

	const initializer = winners => sortLeastToGreatest(winners.slice()); 

	const playOneRound = players => headToHeadMatchups(players, weightedRandomSelection); 

	// Playoff returns an array of length 1 (winner)
	const lengthOfSelectedLinearRing = playoff(sortedLinearRingPathLengths, playOneRound, initializer).pop(); 

	window.console.log("lengthOfSelectedLinearRing:", lengthOfSelectedLinearRing); 

	const selectedLinearRing = linearRingLengthMap[lengthOfSelectedLinearRing]; 

	window.console.log("selectedLinearRing:", selectedLinearRing); 

}; 

export default selectRandomWeightedLinearRing; 
