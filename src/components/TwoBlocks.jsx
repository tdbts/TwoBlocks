import React from 'react';
import TwoBlocksMap from './TwoBlocksMap.jsx';
import twoBlocks from '../twoBlocks'; 
import { NYC_COORDINATES } from '../constants/constants'; 

class TwoBlocks extends React.Component {

	constructor(props) {

		super(props); 

		this.state = {
			initialized: false, 
			locationData: {}
		}; 

	}

	componentDidMount() {
	 	
		this.setState({
			locationData: NYC_COORDINATES
		}); 

	}

	componentDidUpdate() {
			
		if (!(this.state.initialized)) {

			twoBlocks(this.props.canvasId, this.state.locationData);
		
			this.setState({
				initialized: true
			});
			
		}


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
