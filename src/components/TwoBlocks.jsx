/* global document, google, window */

import React from 'react';
import TwoBlocksMap from './TwoBlocksMap';
import TwoBlocksPrompt from './TwoBlocksPrompt'; 
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

		const canvas = this.state.canvas; 

		if (!(canvas)) {

			throw new Error(`No element with ID '#${this.props.canvasId}' could be found on the page.`); 

		} 

		const { lat, lng } = this.state.locationData.CENTER; 
		
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

	onSpinnerRevolution() {

		const { canvas, locationData, panorama, spinner } = this.state; 

		spinner.stop(); 

		const gps = new google.maps.LatLng(locationData.CENTER.lat, locationData.CENTER.lng); 

		const mapOptions = {
			center: gps
		}; 

		const chooseLocationMap = showChooseLocationMap(canvas, mapOptions);

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

		// gameComponents: panorama, spinner 
		const gameComponents = createGameComponents(this.state); 

		console.log("gameComponents:", gameComponents);		
		
		this.setState(gameComponents) 

			.then(() => {

				const { featureCollection } = this.state.locationData;  

				return getRandomPanoramaLocation(featureCollection) 
			
			})

			.then(randomLatLng => {

				window.console.log("randomLatLng.lat():", randomLatLng.lat()); 
				window.console.log("randomLatLng.lng():", randomLatLng.lng()); 

				return this.setState({ 
					currentLatLng: randomLatLng, 
					promptText: 'Where is this?' 
				});   

			})

			.then(() => window.console.log("this.state:", this.state))

			.then(() => this.showSpinner())

			// .then(() => twoBlocks(this.state))

			.catch((...args) => `Caught error with args ${args}`); 				

	}

	showPregameMap() {

		return new Promise(resolve => { 

			const { canvas } = this.state; 

			const mapOptions = {
				center: this.state.currentLatLng
			}; 

			const chooseLocationMap = showChooseLocationMap(canvas, mapOptions);			

			// Each borough is a feature 
			chooseLocationMap.data.loadGeoJson(NYC_BOUNDARIES_DATASET_URL, {}, featureCollection => {

				this.setState({ 
					locationData: Object.assign({}, this.state.locationData, { featureCollection }) 
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

	showSpinner() {

		const { panorama, spinner } = this.state; 

		panorama.setVisible(true); 

		spinner.start(); 

		spinner.once('revolution', () => this.onSpinnerRevolution()); 

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
