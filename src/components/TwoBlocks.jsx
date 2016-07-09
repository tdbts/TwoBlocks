/* global document, window, google */

import React from 'react';
import TwoBlocksMap from './TwoBlocksMap';
import TwoBlocksPrompt from './TwoBlocksPrompt'; 
import twoBlocks from '../twoBlocks'; 
import createGameComponents from '../createGameComponents';
import getRandomPanoramaLocation from '../getRandomPanoramaLocation';  
import showChooseLocationMap from '../showChooseLocationMap'; 
import { NYC_BOUNDARIES_DATASET_URL, nycCoordinates } from '../constants/constants'; 

class TwoBlocks extends React.Component {

	constructor(props) {

		super(props); 

		// Define initial state 
		this.state = {
			canvas: null,
			currentLatLng: null, 
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
			locationData: nycCoordinates
		})

		.then(() => this.initializeTwoBlocks()); 

	}

	initializeTwoBlocks() {

		if (this.state.initialized) return; 

		const { lat, lng } = this.state.locationData.CENTER; 
		const canvas = this.state.canvas; 

		if (!(canvas)) {

			throw new Error(`No element with ID #${this.props.canvasId} could be found on the page.`); 

		} 
		
		const nextState = Object.assign({}, {
			canvas, 
			currentLatLng: new google.maps.LatLng(lat, lng), 
			initialized: true, 
			view: 'map'
		}); 

		this.setState(nextState)

			.then(() => this.showPregameMap())

			.then(() => this.setRandomLocation());

	}

	setRandomLocation() {

		// gameCompnents: panorama, spinner, nycPolygon, nycLatLngMaxMin 
		const gameComponents = createGameComponents(this.state); 

		console.log("gameComponents:", gameComponents);		
		this.setState(gameComponents) 

			.then(() => {
				// console.log("nycPolygon:", nycPolygon); 
				// const { nycPolygon, nycLatLngMaxMin } = this.state;
				const { features } = this.state.locationData;  

				getRandomPanoramaLocation(features) 

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
			
			}); 

	}

	showPregameMap() {

		return new Promise(resolve => { 

			const { canvas } = this.state; 

			const mapOptions = {
				center: this.state.currentLatLng
			}; 

			const chooseLocationMap = showChooseLocationMap(canvas, mapOptions);			

			// Each borough is a feature 
			chooseLocationMap.data.loadGeoJson(NYC_BOUNDARIES_DATASET_URL, {}, features => {
				window.console.log("features:", features); 	

				features.forEach(feature => window.console.log("feature.getProperty('boro_name'):", feature.getProperty('boro_name'))); 

				this.setState({ 
					locationData: Object.assign({}, this.state.locationData, { features }) 
				}); 

				setTimeout(() => {
					
					this.setState({ view: 'panorama' }); 

					resolve(); 

				}, 10000); 		

			}); 

			chooseLocationMap.data.addListener('mouseover', event => {
				
				chooseLocationMap.data.revertStyle(); 
				
				chooseLocationMap.data.overrideStyle(event.feature, {
					fillColor: "#A8FFFC"
				}); 
			
			}); 

			chooseLocationMap.data.addListener('mouseout', () => 

				chooseLocationMap.data.revertStyle()); 	

			}); 	

	}

	/*----------  render()  ----------*/
	
	render() {

		return (
	
			<div id={ this.props.gameId }>
				<TwoBlocksMap view={ this.state.view } panorama={ this.state.panorama } latLng={ this.state.currentLatLng } />
				<TwoBlocksPrompt text={ this.state.promptText } />
			</div>
	
		); 

	}

}

// Assign default props to the constructor 
TwoBlocks.defaultProps = { canvasId: "twoBlocks-map", gameId: "twoBlocks" }; 

export default TwoBlocks; 
