import React from 'react'; 
import twoBlocks from '../twoBlocks'; 

class TwoBlocksMap extends React.Component {

	componentDidMount() {
	    
	    twoBlocks(this.props.canvasId, this.props.coordinates); 

	}

	render() {

		return (

			<div id="twoBlocks-map" className="inherit-dimensions"></div>		
		
		); 

	}

} 

export default TwoBlocksMap; 
