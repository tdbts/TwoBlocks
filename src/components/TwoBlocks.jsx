/* global document, google, window */

import React from 'react';
import TwoBlocksView from './TwoBlocksView';
import TwoBlocksPrompt from './TwoBlocksPrompt';
import calculateDistanceFromMarkerToLocation from '../calculateDistanceFromMarkerToLocation'; 
import createGameComponents from '../createGameComponents';
import getRandomPanoramaLocation from '../getRandomPanoramaLocation';  
import { NYC_BOUNDARIES_DATASET_URL, nycCoordinates } from '../constants/constants'; 

class TwoBlocks extends React.Component {

	constructor(props) {

		super(props); 

		// Define initial state 
		this.state = {
			chooseLocationMap: null, 
			chooseLocationMarker: null, 
			initialized: false, 
			locationData: nycCoordinates, 
			mapCanvas: null, 
			mapLatLng: null,
			mapMarkerVisible: false,  
			panorama: null, 
			panoramaCanvas: null, 
			panoramaLatLng: null, 
			promptText: 'loading...',
			spinner: null,  
			view: 'map' 
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

	componentDidUpdate(prevProps, prevState) {  // eslint-disable-line no-unused-vars

		// Child <TwoBlocksMap /> and <TwoBlocksPanorama /> 
		// components will call methods which update this 
		// component's state with the child components' 
		// respective DOM elements.  Once both elements 
		// exist in state, initialize TwoBlocks.  
		this.initializeTwoBlocks(); 

	}

	initializeTwoBlocks() {

		if (this.state.initialized) return; 

		if (!(this.state.mapCanvas && this.state.panoramaCanvas)) return; 

		const { mapCanvas, panoramaCanvas } = this.state; 

		[ mapCanvas, panoramaCanvas ].forEach(canvas => {

			if (!(canvas)) {

				throw new Error(`No element with ID '#${this.props[ mapCanvas === canvas ? "mapCanvasId" : "panoramaCanvasId" ]}' could be found on the page.`); 

			}

		}); 

		const { lat, lng } = this.state.locationData.CENTER; 

		const mapLatLng = new google.maps.LatLng(lat, lng);  

		const nextState = Object.assign({}, {
			mapLatLng,   
			initialized: true, 
			view: 'map'
		}); 

		this.setState(nextState)

			.then(() => {
				
				// gameComponents: chooseLocationMap, panorama, spinner 
				const gameComponents = createGameComponents(this.state); 

				window.console.log("gameComponents:", gameComponents);		 
				
				return this.setState(gameComponents); 

			})

			.then(() => this.loadCityGeoJSON())

			.then(() => this.startGame()); 

	}

	loadCityGeoJSON() {

		return new Promise(resolve => {

			const { chooseLocationMap } = this.state; 

			if (!(chooseLocationMap)) {

				throw new Error("No 'chooseLocationMap' found in state.  Cannot load city's GeoJSON data."); 

			}

			/*----------  Load GeoJSON  ----------*/
			
			// Each borough is a feature 
			chooseLocationMap.data.loadGeoJson(NYC_BOUNDARIES_DATASET_URL, {}, featureCollection => {

				this.setState({
					locationData: Object.assign({}, this.state.locationData, { featureCollection })
				}); 

				resolve();  

			}); 

			/*----------  Style chooseLocationMap  ----------*/
			
			chooseLocationMap.data.addListener('mouseover', event => {
				
				chooseLocationMap.data.revertStyle(); 
				
				chooseLocationMap.data.overrideStyle(event.feature, {
					fillColor: "#A8FFFC"
				}); 
			
			});

			chooseLocationMap.data.addListener('mouseout', () => {

				chooseLocationMap.data.revertStyle(); 

			}); 				

		}); 

	}

	onMapMounted(mapCanvas) {

		this.setState({ mapCanvas }); 

	}

	onPanoramaMounted(panoramaCanvas) {

		this.setState({ panoramaCanvas }); 

	}

	onSpinnerRevolution() {

		const { chooseLocationMap, chooseLocationMarker, panorama, spinner } = this.state; 

		spinner.stop(); 

		this.setState({
			mapMarkerVisible: true, 
			view: 'map'
		}); 

		const eventToEntityMap = {
			'dragend': chooseLocationMarker, 
			'click': chooseLocationMap
		}; 

		for (const event in eventToEntityMap) {

			google.maps.event.addListener(eventToEntityMap[event], event, () => {

				const distanceFromPanoramaInMiles = calculateDistanceFromMarkerToLocation(panorama, chooseLocationMarker); 

				window.console.log("distanceFromPanoramaInMiles:", distanceFromPanoramaInMiles); 

			}); 

		} 		

	}

	setRandomLocation() {		
 
		const { featureCollection } = this.state.locationData;  
		
		return getRandomPanoramaLocation(featureCollection) 

			.then(randomLatLng => {

				window.console.log("randomLatLng.lat():", randomLatLng.lat()); 
				window.console.log("randomLatLng.lng():", randomLatLng.lng()); 

				return this.setState({ 
					panoramaLatLng: randomLatLng
				});   

			})

			.then(() => window.console.log("this.state:", this.state))

			.catch((...args) => `Caught error with args ${args}`); 				

	}

	startGame() {

		return this.setRandomLocation()
		
			.then(() => {

				setTimeout(() => {

					const { spinner } = this.state; 

					this.setState({
						promptText: 'Where is this?',  
						view: 'panorama'
					});		

					spinner.start(); 

					spinner.once('revolution', () => this.onSpinnerRevolution()); 
				
				}, 5000);

			}); 

	}

	/*----------  render()  ----------*/
	
	render() {

		return (
	
			<div id={ this.props.gameId }>
				<TwoBlocksView 
					mapCanvasId={ this.state.mapCanvasId }
					mapLatLng={ this.state.mapLatLng }
					mapMarker={ this.state.chooseLocationMarker }
					mapMarkerVisible={ this.state.mapMarkerVisible }
					onMapMounted={ this.onMapMounted.bind(this) }
					onPanoramaMounted={ this.onPanoramaMounted.bind(this) } 
					panorama={ this.state.panorama } 
					panoramaLatLng={ this.state.panoramaLatLng } 
					view={ this.state.view } 
				/>
				<TwoBlocksPrompt 
					promptId={ this.props.promptId } 
					text={ this.state.promptText } 
				/>
			</div>
	
		); 

	}

}

TwoBlocks.propTypes = {
	gameId 				: React.PropTypes.string.isRequired, 	
	mapCanvasId 		: React.PropTypes.string.isRequired, 
	panoramaCanvasId 	: React.PropTypes.string.isRequired, 
	promptId 			: React.PropTypes.string.isRequired
}; 

// Assign default props to the constructor 
TwoBlocks.defaultProps = { 
	gameId 				: "twoBlocks", 
	mapCanvasId 		: "twoBlocks-map", 
	panoramaCanvasId 	: "twoBlocks-panorama", 
	promptId 			: "twoBlocks-prompt"
}; 

export default TwoBlocks; 
