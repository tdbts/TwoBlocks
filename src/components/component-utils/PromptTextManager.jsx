import React from 'react'; 
import stylizeBoroughName from './stylizeBoroughName'; 

/*----------  Constructor  ----------*/

const PromptTextManager = function PromptTextManager() {}; 

/*----------  Define Prototype  ----------*/

PromptTextManager.prototype = {

	choosingLocation() {

		return <span>Which borough was the last panorama from?</span>; 

	}, 

	correctBorough(correctBorough) {

		return <span>Correct!  The Street View shown was from <span className="correct-borough">{ stylizeBoroughName(correctBorough) }</span>.</span>; 

	},

	gameOver(totalCorrect, totalRounds) {

		let fractionClass = null; 

		const percentageCorrect = totalCorrect / totalRounds; 

		if (percentageCorrect > 0.66) {

			fractionClass = "green"; 
		
		} else if (percentageCorrect > 0.33) {

			fractionClass = "yellow"; 

		} else {

			fractionClass = "red"; 

		}

		return <span>Game over.  You correctly guessed <span className={ ["total-correct", fractionClass ].join(" ") }>{ totalCorrect.toString() } / { totalRounds.toString() }</span> of the Street View locations.</span>
	
	}, 

	incorrectBorough(selectedBorough, correctBorough) {

		return <span>Sorry, { stylizeBoroughName(selectedBorough) } is incorrect.  The Street View shown was from <span className="correct-borough">{ stylizeBoroughName(correctBorough) }</span>.</span>; 

	}, 

	pregame() {

		return <span>Loading new TwoBlocks game...</span>; 

	}, 

	restart() {

		return <span>Starting new game...</span>; 

	},

	showingPanorama() {

		return <span>Look closely...which borough is this Street View from?</span>; 

	}, 

	turnComplete() {

		return <span>Loading next panorama...</span>; 

	}

}; 

export default PromptTextManager; 
