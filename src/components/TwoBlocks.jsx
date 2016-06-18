import React from 'react';
import TwoBlocksMap from './TwoBlocksMap.jsx';
import { NYC_COORDINATES } from '../constants/constants';  

class TwoBlocks extends React.Component {

	render() {

		return (
	
			<div id={ this.props.gameId }>
				<TwoBlocksMap coordinates={ NYC_COORDINATES } canvasId={ this.props.canvasId } />
			</div>
	
		); 

	}

}

TwoBlocks.defaultProps = { canvasId: "twoBlocks-map", gameId: "twoBlocks" }; 

export default TwoBlocks; 
