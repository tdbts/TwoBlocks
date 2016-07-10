import React from 'react'; 
import TwoBlocksMap from './TwoBlocksMap'; 

class TwoBlocksView extends React.Component {

	render() {

		return (

			<div id="twoBlocks-view" className="inherit-dimensions">
				<TwoBlocksMap view={ this.props.view } panorama={ this.props.panorama } latLng={ this.props.latLng } />
			</div>

		); 
	
	}

} 

export default TwoBlocksView; 
