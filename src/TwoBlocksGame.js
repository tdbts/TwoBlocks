import { EventEmitter } from 'events'; 
import { inherits } from 'util'; 

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

	}, 

	validateArgs(mapCanvas, panoramaCanvas) {

		if (!(mapCanvas) || !(panoramaCanvas)) {

			throw new Error("Invalid arguments passed to TwoBlocksGame() constructor."); 

		}

	}

}); 

export default TwoBlocksGame; 
