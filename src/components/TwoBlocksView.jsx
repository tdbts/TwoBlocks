import React from 'react'; 
import TwoBlocksMap from './TwoBlocksMap'; 
import TwoBlocksPanorama from './TwoBlocksPanorama'; 

class TwoBlocksView extends React.Component {

	getClassName() {

		return [
		
			this.props.twoBlocksClass, 
			"full-dimensions"

		].join(" "); 

	}

	render() {

		const { blockLevelMap, boroughLevelMap, cityLevelMap, onMapMounted, mapConfig, mapTwoBlocksClass, mapType, view } = this.props;		

		return (

			<div className={ this.getClassName() }>
				<TwoBlocksMap 
					blockLevelMap={ blockLevelMap }
					boroughLevelMap={ boroughLevelMap }
					cityLevelMap={ cityLevelMap }
					config={ mapConfig }
					onMapMounted={ onMapMounted }
					mapType={ mapType }
					twoBlocksClass={ mapTwoBlocksClass }
					view={ view }
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
	
	blockLevelMap 			: React.PropTypes.object, 
	boroughLevelMap 		: React.PropTypes.object, 
	cityLevelMap 			: React.PropTypes.object, 
	mapCanvasClassName 		: React.PropTypes.string, 
	mapConfig 				: React.PropTypes.object, 
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
