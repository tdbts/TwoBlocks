import calculateDistanceBetweenLatLngs from './calculateDistanceBetweenLatLngs'; 
import convertMetersToMiles from './convertMetersToMiles'; 

const calculateDistanceFromMarkerToLocation = (panorama, marker, units = 'miles') => {

	const distanceFromPanoramaInMeters = calculateDistanceBetweenLatLngs(panorama.getPosition(), marker.getPosition()); 

	if ('meters' === units) {

		return distanceFromPanoramaInMeters; 

	}

	const distanceFromPanoramaInMiles = convertMetersToMiles(distanceFromPanoramaInMeters).toFixed(3); 

	return distanceFromPanoramaInMiles; 

};

export default calculateDistanceFromMarkerToLocation; 
