import React from 'react'; 
import getViewLayerClassName from './component-utils/getViewLayerClassName'; 

class TwoBlocksMap extends React.Component {

	render() {

		return (

			<div id="twoBlocks-map" className={getViewLayerClassName.call(this)}></div>		
		
		); 

	}

} 

export default TwoBlocksMap; 
