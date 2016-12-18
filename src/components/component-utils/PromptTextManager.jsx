import React from 'react'; 
import stylizeBoroughName from './stylizeBoroughName'; 

/*----------  Constructor  ----------*/

const PromptTextManager = function PromptTextManager() {}; 

/*----------  Define Prototype  ----------*/

PromptTextManager.prototype = {

	choosingLocation() {

		return <p>Which borough was the last panorama from?</p>; 

	}, 

	correctBorough(correctBorough) {

		return <p>Correct!  The Street View shown was from <span className="correct-borough">{ stylizeBoroughName(correctBorough) }</span>.</p>; 

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

		return <p>Game over.  You correctly guessed <span className={ ["total-correct", fractionClass ].join(" ") }>{ totalCorrect.toString() } / { totalRounds.toString() }</span> of the Street View locations.</p>
	
	}, 

	incorrectBorough(selectedBorough, correctBorough) {

		return <p>Sorry, { stylizeBoroughName(selectedBorough) } is incorrect.  The Street View shown was from <span className="correct-borough">{ stylizeBoroughName(correctBorough) }</span>.</p>; 

	}, 

	pregame() {

		return <p>Loading new TwoBlocks game...</p>; 

	}, 

	restart() {

		return <p>Starting new game...</p>; 

	},

	showingPanorama() {

		return <p>Look closely...which borough is this Street View from?</p>; 

	}, 

	turnComplete() {

		return <p>Loading next panorama...</p>; 

	}

}; 

export default PromptTextManager; 
