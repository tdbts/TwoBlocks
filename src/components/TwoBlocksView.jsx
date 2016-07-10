import React from 'react'; 
import TwoBlocksMap from './TwoBlocksMap'; 
import TwoBlocksPanorama from './TwoBlocksPanorama'; 

class TwoBlocksView extends React.Component {

	render() {

		return (

			<div id="twoBlocks-view" className="inherit-dimensions">
				<TwoBlocksMap visible={ 'map' === this.props.view } latLng={ this.props.mapLatLng } />
				<TwoBlocksPanorama visible={ 'panorama' === this.props.view } panorama={ this.props.panorama } latLng={ this.props.panoramaLatLng } />
			</div>

		); 
	
	}

} 

export default TwoBlocksView; 
