/* global document, window, google */

import React from 'react';
import TwoBlocksMap from './TwoBlocksMap';
import TwoBlocksPrompt from './TwoBlocksPrompt'; 
import twoBlocks from '../twoBlocks'; 
import createGameComponents from '../createGameComponents';
import getRandomPanoramaLocation from '../getRandomPanoramaLocation';  
import { NYC_COORDINATES } from '../constants/constants'; 

class TwoBlocks extends React.Component {

	constructor(props) {

		super(props); 

		// Define initial state 
		this.state = {
			canvas: null,
			currentLat: '', 
			currentLng: '',  
			initialized: false, 
			locationData: {}, 
			promptText: 'loading...'
		}; 

		/*----------  Save reference to original setState() method  ----------*/
		
		this._superSetState = this.setState.bind(this); 

		/*----------  Override setState() to be promisified  ----------*/
		
		this.setState = nextState => {

			return new Promise(resolve => {

				this._superSetState(nextState, resolve); 

			}); 

		}; 

	}

	componentDidMount() {
	 	
		this.setState({
			canvas: document.getElementById(this.props.canvasId), 
			locationData: NYC_COORDINATES
		})

		.then(() => this.initializeTwoBlocks()); 

	}

	initializeTwoBlocks() {

		if (!(this.state.initialized)) {

			const { lat, lng } = this.state.locationData.center; 
			const canvas = this.state.canvas; 

			if (!(canvas)) {

				throw new Error(`No element with ID #${this.props.canvasId} could be found on the page.`); 

			}

			const gameComponents = createGameComponents(this.state); 
			
			/*----------  Add game components to state  ----------*/
			
			const nextState = Object.assign({}, gameComponents, {
				canvas, 
				currentLatLng: new google.maps.LatLng(lat, lng), 
				initialized: true
			}); 

			this.setState(nextState)

				.then(() => this.setRandomLocation());

		}		

	}

	setRandomLocation() {

		const { panorama, nycPolygon, nycLatLngMaxMin } = this.state; 

		getRandomPanoramaLocation(panorama, nycPolygon, nycLatLngMaxMin) 

			.then(randomLatLng => {

				window.console.log("randomLatLng.lat():", randomLatLng.lat()); 
				window.console.log("randomLatLng.lng():", randomLatLng.lng()); 

				this.setState({ 
					currentLatLng: randomLatLng, 
					promptText: 'Where is this?' 
				})

				.then(() => twoBlocks(this.state));  

			})

			.catch((...args) => `Caught error with args ${args}`); 		

	}

	/*----------  render()  ----------*/
	
	render() {

		return (
	
			<div id={ this.props.gameId }>
				<TwoBlocksMap panorama={ this.state.panorama } latLng={ this.state.currentLatLng } />
				<TwoBlocksPrompt text={ this.state.promptText } />
			</div>
	
		); 

	}

}

// Assign default props to the constructor 
TwoBlocks.defaultProps = { canvasId: "twoBlocks-map", gameId: "twoBlocks" }; 

export default TwoBlocks; 
