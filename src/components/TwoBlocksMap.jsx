import React from 'react'; 
import getViewLayerClassName from './component-utils/getViewLayerClassName'; 

class TwoBlocksMap extends React.Component {

	componentDidMount() {

		this.props.onMapMounted(this._mapCanvas); 

	}

	componentDidUpdate(prevProps) {

		const { mapMarkerVisible, mapMarker } = this.props; 

		if (mapMarkerVisible === prevProps.mapMarkerVisible) return; 

		mapMarker.setVisible(mapMarkerVisible); 

	}

	render() {

		return (

			<div 
				id={ this.props.id } 
				className={getViewLayerClassName.call(this)} 
				ref={ mapCanvas => (this._mapCanvas = mapCanvas) }
			>
			</div>		
		
		); 

	}

} 

TwoBlocksMap.propTypes = {

	id 					: React.PropTypes.string, 
	mapMarker 			: React.PropTypes.object, 
	mapMarkerVisible 	: React.PropTypes.bool, 
	onMapMounted 		: React.PropTypes.func.isRequired

}; 

export default TwoBlocksMap; 
