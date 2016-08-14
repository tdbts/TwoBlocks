import React from 'react'; 
import TwoBlocksMap from './TwoBlocksMap'; 
import TwoBlocksPanorama from './TwoBlocksPanorama'; 

class TwoBlocksView extends React.Component {

	render() {

		return (

			<div className="two-blocks-view" className="inherit-dimensions">
				<TwoBlocksMap 
					className={ this.props.mapCanvasClassName } 
					latLng={ this.props.mapLatLng } 
					onMapMounted={ this.props.onMapMounted }
					mapMarker={ this.props.mapMarker }
					mapMarkerVisible={ this.props.mapMarkerVisible }
					visible={ 'map' === this.props.view } 
				/>
				<TwoBlocksPanorama 
					className={ this.props.panoramaCanvasClassName } 
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
	
	mapCanvasClassName 		: React.PropTypes.string, 
	mapLatLng 				: React.PropTypes.object, 
	mapMarker 				: React.PropTypes.object, 
	mapMarkerVisible 		: React.PropTypes.bool, 
	onMapMounted 			: React.PropTypes.func.isRequired, 
	onPanoramaMounted 		: React.PropTypes.func.isRequired, 
	panorama 				: React.PropTypes.object, 
	panoramaCanvasClassName : React.PropTypes.string, 
	panoramaLatLng 			: React.PropTypes.object,	
	view 					: React.PropTypes.string.isRequired

}; 

export default TwoBlocksView; 
