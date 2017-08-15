import React from 'react';
import TwoBlocksMap from '../Map/TwoBlocksMap.refactor';
import TwoBlocksPanorama from '../Panorama/TwoBlocksPanorama.refactor';

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
