import React from 'react'; 
import getViewLayerClassName from './component-utils/getViewLayerClassName'; 

const TWO_BLOCKS_CLASS = "two-blocks-panorama"; 

class TwoBlocksPanorama extends React.Component {

	componentDidMount() {
		
		this.props.onPanoramaMounted(this._panoramaCanvas); 

	}

	componentDidUpdate(previousProps) {

		const { latLng, panorama } = this.props; 

		if (!(latLng) || !(panorama)) return; 

		if (latLng === previousProps.latLng) return;
 
		panorama.setPosition(latLng); 

	}	

	render() {

		return (
			
			<div 
				className={ getViewLayerClassName(TWO_BLOCKS_CLASS, this.props.visible) } 
				ref={ panoramaCanvas => (this._panoramaCanvas = panoramaCanvas) }
			>
			</div>

		); 

	}

} 

TwoBlocksPanorama.propTypes = {
	
	latLng 				: React.PropTypes.object,
	onPanoramaMounted 	: React.PropTypes.func.isRequired, 
	panorama 			: React.PropTypes.object,  
	visible 			: React.PropTypes.bool

}; 

export default TwoBlocksPanorama; 
