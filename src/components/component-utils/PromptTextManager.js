import stylizeBoroughName from './stylizeBoroughName'; 

/*----------  Constructor  ----------*/

const PromptTextManager = function PromptTextManager() {}; 

/*----------  Define Prototype  ----------*/

PromptTextManager.prototype = {

	choosingLocation() {

		return "Which borough was the last panorama from?"; 

	}, 

	correctBorough(correctBorough) {

		return `Correct!  The Street View shown was from ${stylizeBoroughName(correctBorough)}.`; 

	},

	gameOver(totalCorrect, totalRounds) {

		return `Game over.  You correctly guessed ${totalCorrect.toString()} / ${totalRounds.toString()} of the Street View locations.`; 		
	
	}, 

	incorrectBorough(selectedBorough, correctBorough) {

		return `Sorry, ${stylizeBoroughName(selectedBorough)} is incorrect.  The Street View shown was from ${stylizeBoroughName(correctBorough)}.`; 

	}, 

	pregame() {

		return "Loading new TwoBlocks game..."; 

	}, 

	restart() {

		return "Starting new game..."; 

	},

	showingPanorama() {

		return "Look closely...which borough is this Street View from?"; 

	}, 

	turnComplete() {

		return "Loading next panorama..."; 

	}

}; 

export default PromptTextManager; 
