import React from 'react'; 
import TwoBlocksMap from './TwoBlocksMap'; 
import TwoBlocksPanorama from './TwoBlocksPanorama'; 
import TwoBlocksCountdown from './TwoBlocksCountdown'; 

const TWO_BLOCKS_CLASS = "two-blocks-view"; 

class TwoBlocksView extends React.Component {

	getClassName() {

		return [
		
			TWO_BLOCKS_CLASS, 
			"full-dimensions"

		].join(" "); 

	}

	render() {

		const { countdownTimeLeft, interchangeHidden, onMapMounted, maps, mapType, mobile, onPanoramaMounted, panorama, view } = this.props;		

		return (

			<div className={ this.getClassName() }>
				<TwoBlocksMap 
					blockLevelMap={ maps.block.instance }
					boroughLevelMap={ maps.borough.instance }
					cityLevelMap={ maps.city.instance }
					onMapMounted={ onMapMounted }
					mapType={ mapType }
					visible={ 'map' === view }
				/>			
				<TwoBlocksPanorama 
					latLng={ panorama && panorama.getPosition() }
					onPanoramaMounted={ onPanoramaMounted } 
					panorama={ panorama } 
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
	mapType 				: React.PropTypes.string, 
	mobile 					: React.PropTypes.bool.isRequired, 
	onMapMounted 			: React.PropTypes.func.isRequired, 
	onPanoramaMounted 		: React.PropTypes.func.isRequired, 
	panorama 				: React.PropTypes.object,  
	view 					: React.PropTypes.string.isRequired

}; 

export default TwoBlocksView; 
