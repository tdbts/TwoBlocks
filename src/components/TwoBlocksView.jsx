import React from 'react'; 
import TwoBlocksMap from './TwoBlocksMap'; 
import TwoBlocksPanorama from './TwoBlocksPanorama'; 
import TwoBlocksCountdown from './TwoBlocksCountdown'; 

class TwoBlocksView extends React.Component {

	getClassName() {

		return [
		
			this.props.twoBlocksClass, 
			"full-dimensions"

		].join(" "); 

	}

	render() {

		const { countdownTimeLeft, interchangeHidden, onMapMounted, maps, mapTwoBlocksClass, mapType, mobile, panorama, view } = this.props;		

		return (

			<div className={ this.getClassName() }>
				<TwoBlocksMap 
					blockLevelMap={ maps.block.instance }
					boroughLevelMap={ maps.borough.instance }
					cityLevelMap={ maps.city.instance }
					onMapMounted={ onMapMounted }
					mapType={ mapType }
					twoBlocksClass={ mapTwoBlocksClass }
					visible={ 'map' === view }
				/>			
				<TwoBlocksPanorama 
					latLng={ panorama.latLng }
					onPanoramaMounted={ this.props.onPanoramaMounted } 
					panorama={ panorama.instance }
					twoBlocksClass={ this.props.panoramaTwoBlocksClass } 
					visible={ 'panorama' === view } 
				/>
				<TwoBlocksCountdown 
					interchangeHidden={ interchangeHidden }
					mobile={ mobile }
					timeLeft={ countdownTimeLeft }
				/>
			</div>

		); 
	
	}

} 

TwoBlocksView.propTypes = {
	
	countdownTimeLeft 		: React.PropTypes.number, 
	interchangeHidden 		: React.PropTypes.bool, 
	mapCanvasClassName 		: React.PropTypes.string, 
	maps 					: React.PropTypes.object, 
	mapTwoBlocksClass 		: React.PropTypes.string.isRequired, 
	mapType 				: React.PropTypes.string, 
	mobile 					: React.PropTypes.bool.isRequired, 
	onMapMounted 			: React.PropTypes.func.isRequired, 
	onPanoramaMounted 		: React.PropTypes.func.isRequired, 
	panorama 				: React.PropTypes.object, 
	panoramaTwoBlocksClass 	: React.PropTypes.string, 
	twoBlocksClass 			: React.PropTypes.string.isRequired, 
	view 					: React.PropTypes.string.isRequired

}; 

export default TwoBlocksView; 
