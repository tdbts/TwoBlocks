import React from 'react'; 
import getViewLayerClassName from './component-utils/getViewLayerClassName'; 

class TwoBlocksMap extends React.Component {

	componentDidMount() {

		this.props.onMapMounted(this.props.mapType, this._mapCanvas); 

	}

	render() {

		return (

			<div 
				className={ getViewLayerClassName(this.props.twoBlocksClass, this.props.visible) } 
				ref={ mapCanvas => (this._mapCanvas = mapCanvas) }
			>
			</div>		
		
		); 

	}

} 

TwoBlocksMap.propTypes = {

	id 					: React.PropTypes.string, 
	mapType 			: React.PropTypes.string.isRequired, 
	onMapMounted 		: React.PropTypes.func

}; 

export default TwoBlocksMap; 
