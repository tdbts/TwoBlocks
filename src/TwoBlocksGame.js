import { EventEmitter } from 'events'; 
import { inherits } from 'util';
import { nycCoordinates } from './constants/constants';  

const TwoBlocksGame = function TwoBlocksGame(mapCanvas, panoramaCanvas) {

	this.validateArgs(mapCanvas, panoramaCanvas); 

	this.mapCanvas = mapCanvas; 
	this.panoramaCanvas = panoramaCanvas; 

}; 

/*----------  Inherit from EventEmitter  ----------*/

inherits(TwoBlocksGame, EventEmitter); 

/*----------  Define TwoBlocksGame Prototype  ----------*/

TwoBlocksGame.prototype = Object.assign(TwoBlocksGame.prototype, {

	startGame() {

		this.emit('gamestage', 'pregame'); 

		this.emit('location_data', nycCoordinates); 

		const { lat, lng } = nycCoordinates.CENTER; 

		const mapLatLng = new google.maps.LatLng(lat, lng); 

		this.emit('view', {
			mapLatLng, 
			view: 'map' 
		}); 

	}, 

	validateArgs(mapCanvas, panoramaCanvas) {

		if (!(mapCanvas) || !(panoramaCanvas)) {

			throw new Error("Invalid arguments passed to TwoBlocksGame() constructor."); 

		}

	}

}); 

export default TwoBlocksGame; 
