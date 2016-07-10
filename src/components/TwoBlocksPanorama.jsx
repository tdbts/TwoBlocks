import React from 'react'; 
import getViewLayerClassName from './component-utils/getViewLayerClassName'; 

class TwoBlocksPanorama extends React.Component {

	componentDidUpdate(previousProps) {

		const { latLng, panorama } = this.props; 

		if (!(latLng) || !(panorama)) return; 

		if (latLng.equals(previousProps.latLng)) return;

		panorama.setPosition(latLng); 

	}	

	render() {

		return (
			
			<div id="twoBlocks-panorama" className={ getViewLayerClassName.call(this) }></div>

		); 

	}

} 

export default TwoBlocksPanorama; 
