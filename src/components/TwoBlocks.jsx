/* global document, window, google */

import React from 'react';
import TwoBlocksMap from './TwoBlocksMap';
import twoBlocks from '../twoBlocks'; 
import createGameComponents from '../createGameComponents'; 
import { NYC_COORDINATES } from '../constants/constants'; 

class TwoBlocks extends React.Component {

	constructor(props) {

		super(props); 

		this.state = {
			canvas: null,
			currentLat: '', 
			currentLng: '',  
			initialized: false, 
			locationData: {}
		}; 

	}

	componentDidMount() {
	 	
		this.setState({
			canvas: document.getElementById(this.props.canvasId), 
			locationData: NYC_COORDINATES
		});

	}

	componentDidUpdate() {
			
		if (!(this.state.initialized)) {
  
			const { lat, lng } = this.state.locationData.center; 
			const canvas = this.state.canvas; 

			if (!(canvas)) {

				throw new Error(`No element with ID #${this.props.canvasId} could be found on the page.`); 

			}

			const gameComponents = createGameComponents(this.state); 
			
			// TODO: Separate current lat / lng information into 
			// LatLng instance, and lat / lng strings 
			this.setState(Object.assign({}, gameComponents, {
				canvas, 
				currentLat: lat, 
				currentLng: lng, 
				initialized: true
			}));

		} else {

			window.console.log('TwoBlocks INITIALIZED.'); 

			twoBlocks(this.state); 

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
