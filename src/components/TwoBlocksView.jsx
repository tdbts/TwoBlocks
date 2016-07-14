import React from 'react'; 
import TwoBlocksMap from './TwoBlocksMap'; 
import TwoBlocksPanorama from './TwoBlocksPanorama'; 

class TwoBlocksView extends React.Component {

	render() {

		return (

			<div id="twoBlocks-view" className="inherit-dimensions">
				<TwoBlocksMap 
					id={ this.props.mapCanvasId } 
					latLng={ this.props.mapLatLng } 
					onMapMounted={ this.props.onMapMounted }
					visible={ 'map' === this.props.view } 
				/>
				<TwoBlocksPanorama 
					id={ this.props.panoramaCanvasId } 
					latLng={ this.props.panoramaLatLng }
					onPanoramaMounted={ this.props.onPanoramaMounted } 
					panorama={ this.props.panorama } 
					visible={ 'panorama' === this.props.view } 
				/>
			</div>

		); 
	
	}

} 

TwoBlocksView.propTypes = {
	
	mapCanvasId 		: React.PropTypes.string, 
	mapLatLng 			: React.PropTypes.object, 
	onMapMounted 		: React.PropTypes.func.isRequired, 
	onPanoramaMounted 	: React.PropTypes.func.isRequired, 
	panorama 			: React.PropTypes.object, 
	panoramaCanvasId 	: React.PropTypes.string, 
	panoramaLatLng 		: React.PropTypes.object,	
	view 				: React.PropTypes.string.isRequired

}; 

export default TwoBlocksView; 
