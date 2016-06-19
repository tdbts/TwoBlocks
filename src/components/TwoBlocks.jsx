import React from 'react';
import TwoBlocksMap from './TwoBlocksMap.jsx';
import { NYC_COORDINATES } from '../constants/constants'; 
import twoBlocks from '../twoBlocks'; 

class TwoBlocks extends React.Component {

	componentDidMount() {
	 	
		twoBlocks(this.props.canvasId, NYC_COORDINATES); 	

	}

	render() {

		return (
	
			<div id={ this.props.gameId }>
				<TwoBlocksMap />
			</div>
	
		); 

	}

}

// Assign default props to the constructor 
TwoBlocks.defaultProps = { canvasId: "twoBlocks-map", gameId: "twoBlocks" }; 

export default TwoBlocks; 
