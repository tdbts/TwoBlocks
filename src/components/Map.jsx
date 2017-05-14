import React from 'react'; 
import once from '../utils/once';

const updateConfig = function updateConfig(mapInstance, config) {

	if (!(config) || !(mapInstance)) return; 

	return mapInstance.setOptions(config); 

}; 


/*----------  Component  ----------*/

const Map = function Map(props) {

	const { className, config, mapInstance, mapType, onRef } = props; 

	const callOnceOnRef = once(mapCanvas => onRef(mapType, mapCanvas));

	updateConfig(mapInstance, config); 
	
	return (

		<div
			className={ className }
			ref={ callOnceOnRef }
		></div>	
	
	);
	
}; 

/*----------  Props Validation  ----------*/

Map.propTypes = {

	className: React.PropTypes.string.isRequired, 
	config: React.PropTypes.object, 
	mapInstance: React.PropTypes.object, 
	mapType: React.PropTypes.string, 
	onRef: React.PropTypes.func.isRequired

}; 

export default Map; 
