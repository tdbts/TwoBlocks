import React from 'react'; 
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PregamePrompt from '../PregamePrompt';  
import ShowingPanoramaPrompt from '../ShowingPanoramaPrompt'; 
import stylizeBoroughName from './stylizeBoroughName'; 

/*----------  Constructor  ----------*/

const PromptManager = function PromptManager() {}; 

/*----------  Define Prototype  ----------*/

PromptManager.prototype = {

	choosingLocation(consideredBorough) {

		const type = 'choosing-location-prompt'; 

		const message = []; 

		const question = "Which borough was the last panorama from?"; 

		message.push(question); 

		if (consideredBorough) {

			message.push(" "); 
			message.push(stylizeBoroughName(consideredBorough));
			message.push("?");  

		}
 
		const content = <span className={ type } key={ type }>{ message }</span>; 

		return {
			content, 
			type
		}; 

	}, 

	correctBorough(correctBorough) {

		const type = 'correct-borough-prompt'; 

		const content = <span className={ type } key={ type }>Correct!  The Street View shown was from <span className="correct-borough">{ stylizeBoroughName(correctBorough) }</span>.</span>; 

		return {
			content, 
			type
		}; 

	},

	gameOver(totalCorrect, totalRounds) {

		let fractionClass = null; 

		const type = 'game-over-prompt';

		const percentageCorrect = totalCorrect / totalRounds; 

		if (percentageCorrect > 0.66) {

			fractionClass = 'green'; 
		
		} else if (percentageCorrect > 0.33) {

			fractionClass = 'yellow'; 

		} else {

			fractionClass = 'red'; 

		}

		const className = ['total-correct', fractionClass ].join(" ").trim(); 

		const content = <span className={ type } key={ type }>Game over.  You correctly guessed <span className={ className }>{ totalCorrect.toString() } / { totalRounds.toString() }</span> of the Street View locations.</span>
	
		return {
			content, 
			type
		}; 

	}, 

	incorrectBorough(selectedBorough, correctBorough) {

		const type = 'incorrect-borough-prompt'; 

		const content = <span className={ type } key={ type }>Sorry, { stylizeBoroughName(selectedBorough) } is incorrect.  The Street View shown was from <span className="correct-borough">{ stylizeBoroughName(correctBorough) }</span>.</span>; 

		return {
			content, 
			type
		}; 

	}, 

	pregame() {

		const type = 'pregame-prompt'; 

		const content = <PregamePrompt key={ type } type={ type } />; 

		return {
			content, 
			type
		}

	}, 

	restart() {

		const type = 'restart-prompt'; 

		const content = <span className={ type } key={ type }>Starting new game...</span>; 

		return {
			content, 
			type
		}; 

	},

	showingPanorama() {

		const type = 'showing-panorama-prompt'; 

		// const content = <span className={ type } key={ type }>Look closely...which borough is this Street View from?</span>; 

		// return {
		// 	content, 
		// 	type
		// }; 

		const content = <ShowingPanoramaPrompt key={ type } type={ type } />;

		return {
			content, 
			type
		}; 

	}, 

	turnComplete() {

		const type = 'turn-complete-prompt'; 

		const content = <span className={ type } key={ type }>Loading next panorama...</span>; 

		return {
			content, 
			type
		}; 

	}

}; 

export default PromptManager; 
