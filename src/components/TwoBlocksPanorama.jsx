/* global window */

import React from 'react'; 
import getViewLayerClassName from './component-utils/getViewLayerClassName'; 

class TwoBlocksPanorama extends React.Component {

	componentDidMount() {
		
		this.props.onPanoramaMounted(this._panoramaCanvas); 

	}

	componentDidUpdate(previousProps) {

		const { latLng, panorama } = this.props; 

		if (!(latLng) || !(panorama)) return; 

		if (latLng.equals(previousProps.latLng)) return;

		panorama.setPosition(latLng); 

	}	

	render() {

		return (
			
			<div 
				className="two-blocks-panorama" 
				className={ getViewLayerClassName.call(this) } 
				ref={ panoramaCanvas => (this._panoramaCanvas = panoramaCanvas) }
			>
			</div>

		); 

	}

} 

TwoBlocksPanorama.propTypes = {
	
	latLng 				: React.PropTypes.object,
	onPanoramaMounted 	: React.PropTypes.func.isRequired, 
	panorama 			: React.PropTypes.object

}; 

export default TwoBlocksPanorama; 
