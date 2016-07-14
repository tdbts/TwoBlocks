/* global document, google, window */

import React from 'react';
import TwoBlocksView from './TwoBlocksView';
import TwoBlocksPrompt from './TwoBlocksPrompt'; 
import createGameComponents from '../createGameComponents';
import getRandomPanoramaLocation from '../getRandomPanoramaLocation';  
import { NYC_BOUNDARIES_DATASET_URL, nycCoordinates } from '../constants/constants'; 

class TwoBlocks extends React.Component {

	constructor(props) {

		super(props); 

		// Define initial state 
		this.state = {
			initialized: false, 
			locationData: nycCoordinates, 
			mapCanvas: null, 
			mapLatLng: null, 
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

		if (this.state.initialized) return; 

		// Children TwoBlocksMap and TwoBlocksPanorama 
		// components will call methods which update this 
		// component's state with the child components' 
		// respective DOM elements.  Once both elements 
		// exist in state, initialize TwoBlocks.  
		if (this.state.mapCanvas && this.state.panoramaCanvas) {

			this.initializeTwoBlocks(); 

		}

	}

	initializeTwoBlocks() {

		if (this.state.initialized) return; 

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

			.then(() => this.showPregameMap())

			.then(() => this.startGame()); 

	}

	onMapMounted(mapCanvas) {

		this.setState({ mapCanvas }); 

	}

	onPanoramaMounted(panoramaCanvas) {

		this.setState({ panoramaCanvas }); 

	}

	onSpinnerRevolution() {

		const { chooseLocationMap, locationData, panorama, spinner } = this.state; 

		spinner.stop(); 

		this.setState({
			view: 'map'
		}); 

		// Outside the polygon boundaries, in the Atlantic Ocean 
		const { lat: markerLat, lng: markerLng } = locationData.MARKER_PLACEMENT; 

		const markerOptions = {
			animation: google.maps.Animation.BOUNCE, 
			draggable: true, 
			map: chooseLocationMap, 
			position: new google.maps.LatLng(markerLat, markerLng)
		}; 

		const chooseLocationMarker = new google.maps.Marker(markerOptions); 

		google.maps.event.addListener(chooseLocationMarker, 'dragstart', () => chooseLocationMarker.setAnimation(null)); 

		google.maps.event.addListener(chooseLocationMap, 'click', e => {

			const { latLng } = e; 

			chooseLocationMarker.setPosition(latLng); 
			chooseLocationMarker.setAnimation(null); 

		});

		const calculateDistanceBetweenLatLngs = function calculateDistanceBetweenLatLngs(first, second) {
		
			return google.maps.geometry.spherical.computeDistanceBetween(first, second); 	
		
		};

		const convertMetersToMiles = function convertMetersToMiles(meters) {
		
			const MILES_PER_METER = 0.000621371; 

			return meters * MILES_PER_METER; 
		
		}; 

		const calculateDistanceFromMarkerToLocation = (panorama, marker, units = 'miles') => {

			const distanceFromPanoramaInMeters = calculateDistanceBetweenLatLngs(panorama.getPosition(), marker.getPosition()); 

			if ('meters' === units) {

				return distanceFromPanoramaInMeters; 

			}

			const distanceFromPanoramaInMiles = convertMetersToMiles(distanceFromPanoramaInMeters).toFixed(3); 

			return distanceFromPanoramaInMiles; 

		}; 

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

		// Each borough is a feature 
		chooseLocationMap.data.loadGeoJson(NYC_BOUNDARIES_DATASET_URL); 

		chooseLocationMap.data.addListener('mouseover', event => {
			
			chooseLocationMap.data.revertStyle(); 
			
			chooseLocationMap.data.overrideStyle(event.feature, {
				fillColor: "#A8FFFC"
			}); 
		
		}); 

		chooseLocationMap.data.addListener('mouseout', () => chooseLocationMap.data.revertStyle()); 		

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

	showPregameMap() {

		return new Promise(resolve => { 

			const { chooseLocationMap } = this.state; 	

			// Each borough is a feature 
			chooseLocationMap.data.loadGeoJson(NYC_BOUNDARIES_DATASET_URL, {}, featureCollection => {

				this.setState({ 
					locationData: Object.assign({}, this.state.locationData, { featureCollection }) 
				}); 

				resolve();  	 	

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
