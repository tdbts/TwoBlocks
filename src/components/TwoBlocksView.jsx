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
					mapType={ 'city-level' }
					twoBlocksClass={ this.props.mapTwoBlocksClass } 
					visible={ ('map' === this.props.view) && ('city-level' === this.props.mapType) } 
				/>
				<TwoBlocksMap 
					latLng={ this.props.mapLatLng } 
					mapType={ 'borough-level' }
					onMapMounted={ this.props.onMapMounted }
					twoBlocksClass={ "two-blocks-borough-level-map" }
					visible={ ('map' === this.props.view) && ('borough-level' === this.props.mapType) }
				/>
				<TwoBlocksMap 
					latLng={ this.props.mapLatLng } 
					mapType={ 'block-level' }
					onMapMounted={ this.props.onMapMounted }
					twoBlocksClass={ "two-blocks-block-level-map" }
					visible={ ('map' === this.props.view) && ('block-level' === this.props.mapType) }
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
	mapType 				: React.PropTypes.string, 
	onMapMounted 			: React.PropTypes.func.isRequired, 
	onPanoramaMounted 		: React.PropTypes.func.isRequired, 
	panorama 				: React.PropTypes.object, 
	panoramaTwoBlocksClass 	: React.PropTypes.string, 
	panoramaLatLng 			: React.PropTypes.object,	
	twoBlocksClass 			: React.PropTypes.string.isRequired, 
	view 					: React.PropTypes.string.isRequired

}; 

export default TwoBlocksView; 
