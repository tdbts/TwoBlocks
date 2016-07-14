import React from 'react'; 
import getViewLayerClassName from './component-utils/getViewLayerClassName'; 

class TwoBlocksMap extends React.Component {

	componentDidMount() {

		this.props.onMapMounted(this._mapCanvas); 

	}

	render() {

		return (

			<div 
				id="twoBlocks-map" 
				className={getViewLayerClassName.call(this)} 
				ref={ mapCanvas => (this._mapCanvas = mapCanvas) }
			>
			</div>		
		
		); 

	}

} 

TwoBlocksMap.propTypes = {

	onMapMounted: React.PropTypes.func.isRequired

}; 

export default TwoBlocksMap; 
