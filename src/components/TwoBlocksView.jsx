import React from 'react'; 
import TwoBlocksMap from './TwoBlocksMap'; 
import TwoBlocksPanorama from './TwoBlocksPanorama'; 

class TwoBlocksView extends React.Component {

	getClassName() {

		return [this.props.twoBlocksClass, "inherit-dimensions"].join(" "); 

	}

	render() {

		return (

			<div className={ this.getClassName() }>
				<TwoBlocksMap 
					latLng={ this.props.mapLatLng } 
					onMapMounted={ this.props.onMapMounted }
					mapMarker={ this.props.mapMarker }
					mapMarkerVisible={ this.props.mapMarkerVisible }
					twoBlocksClass={ this.props.mapTwoBlocksClass } 
					visible={ 'map' === this.props.view } 
				/>
				<TwoBlocksPanorama 
					latLng={ this.props.panoramaLatLng }
					onPanoramaMounted={ this.props.onPanoramaMounted } 
					panorama={ this.props.panorama }
					twoBlocksClass={ this.props.panoramaTwoBlocksClass } 
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
	mapTwoBlocksClass 		: React.PropTypes.string.isRequired, 
	onMapMounted 			: React.PropTypes.func.isRequired, 
	onPanoramaMounted 		: React.PropTypes.func.isRequired, 
	panorama 				: React.PropTypes.object, 
	panoramaTwoBlocksClass 	: React.PropTypes.string, 
	panoramaLatLng 			: React.PropTypes.object,	
	twoBlocksClass 			: React.PropTypes.string.isRequired, 
	view 					: React.PropTypes.string.isRequired

}; 

export default TwoBlocksView; 
