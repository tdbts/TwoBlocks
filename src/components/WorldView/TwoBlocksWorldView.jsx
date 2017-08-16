import React from 'react';
import TwoBlocksMap from '../Map/TwoBlocksMap';
import TwoBlocksPanorama from '../Panorama/TwoBlocksPanorama';

export default function TwoBlocksWorldView(props) {

	return (

		<div className={ getContainerClassName() }>
			<TwoBlocksMap geoJSON={ props.geoJSON } />
			<TwoBlocksPanorama />
		</div>

	);	

}

/*----------  Helper Functions  ----------*/

const getContainerClassName = function getContainerClassName() {

	return [

		"two-blocks-view",
		"fill-container"

	].join(" ");
	
}; 
