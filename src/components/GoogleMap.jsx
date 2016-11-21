/* eslint-disable */

import React from 'react'; 

const updateConfig = function updateConfig(mapInstance, config) {

	if (!(config) || !(mapInstance)) return; 

	return mapInstance.setOptions(config); 

}; 


/*----------  Component  ----------*/

const GoogleMap = function Map(props) {

	const { className, config, mapInstance, mapType, onRef } = props; 

	updateConfig(mapInstance, config); 
	
	return (

		<div
			className={ className }
			ref={ mapCanvas => onRef(mapType, mapCanvas) }
		></div>	
	
	);
	
}; 

/*----------  Props Validation  ----------*/

GoogleMap.propTypes = {

	className: React.PropTypes.string.isRequired, 
	config: React.PropTypes.object, 
	mapInstance: React.PropTypes.object, 
	mapType: React.PropTypes.string, 
	onRef: React.PropTypes.func.isRequired

}; 

export default GoogleMap; 
