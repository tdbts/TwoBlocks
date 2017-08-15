import React from 'react';
import twoBlocksUtils from '../../game-utils/twoBlocksUtils';
import { gameStages } from '../../constants/constants';

export default class Content {

	constructor(prompt) {

		this._promptTypes = prompt.promptTypes;

	}

	_getPregame() {

		const type = this._promptTypes.PREGAME;

		const message = "Loading new TwoBlocks game...";

		return (

			<span className={ type } key={ type }>{ message }</span>

		);

	}

	_getLoadingPanorama() {

		const type = this._promptTypes.LOADING_PANORAMA;

		const message = "Loading next panorama...";

		return (

			<span className={ type } key={ type }>{ message }</span>

		);
		
	}

	_getShowingPanorama() {

		const type = this._promptTypes.SHOWING_PANORAMA;

		const showAlways = "Look closely...";

		const showAfter = "Which borough is this NYC Street View from?";

		const showAfterClassList = [ type, "show-after" ].join(" ");
	
		return (

			<div>
				<span className={ type } key={ type }>{ showAlways }</span>
				<span className={ showAfterClassList }>{ showAfter }</span>
			</div>

		);

	}

	_getGuessingLocation(props) {

		const type = this._promptTypes.GUESSING_LOCATION;

		const message = this._getGuessingLocationMessage(props);

		return (

			<span className={ type } key={ type }>{ message }</span>

		);

	}

	_getGuessingLocationMessage(props) {

		const { consideredBorough } = props;

		const question = "Where in NYC are you?";

		const messageList = [ question ];

		if (consideredBorough) {

			messageList.push(consideredBorough.getName() + "?");

		}

		return messageList.join(" ");

	}


	_getEvaluatingAnswer(props) {

		let content = null;

		const { randomLocation, selectedBorough } = props;
		
		if (twoBlocksUtils.answerIsCorrect(randomLocation, selectedBorough)) {

			content = this._getCorrectAnswer(props);

		} else {

			content = this._getIncorrectAnswer(props);

		}

		return content;

	}

	_getCorrectAnswer(props) {

		const { borough } = props.randomLocation;

		const type = this._promptTypes.CORRECT_BOROUGH;

		const mainText = "Correct!  The Street View shown was from ";

		const punctuation = ".";

		return (

			<span className={ type } key={ type }>{ mainText }
				<span className="correct-borough">{ borough.getName() }</span>{ punctuation }
			</span>

		);

	}

	_getIncorrectAnswer(props) {

		const { randomLocation, selectedBorough } = props;

		const type = this._promptTypes.INCORRECT_BOROUGH;

		const incorrectBorough = selectedBorough.getName();

		const correctBorough = randomLocation.borough.getName();

		const mainText = `Sorry, ${ incorrectBorough } is incorrect.  The Street View shown was from `;

		const punctuation = ".";

		return (

			<span className={ type } key={ type }>{ mainText }
				<span className="correct-borough">{ correctBorough }</span>{ punctuation }
			</span>

		);

	}

	_getPostgame(props) {

		const { roundsPlayed } = props;

		const type = this._promptTypes.POSTGAME;

		const fractionClass = this._getPostgameFractionClass(this._getTotalCorrectAnswers(props), roundsPlayed);

		const startText = "Game over.  You correctly guessed ";

		const endText = " of the Street View locations.";

		const totalCorrectClassList = [ 'total-correct', fractionClass ].join(" ").trim();

		const totalCorrectAnswers = this._getTotalCorrectAnswers(props);

		const correctAnswersFraction = [ totalCorrectAnswers, "/", roundsPlayed ].join(" ");

		return (

			<span className={ type } key={ type }>{ startText }
				<span className={ totalCorrectClassList }>{ correctAnswersFraction }</span>{ endText }
			</span>

		);

	}

	_getPostgameFractionClass(totalCorrect, totalRounds) {

		let fractionClass = null; 

		const percentageCorrect = totalCorrect / totalRounds; 

		if (percentageCorrect > 0.66) {

			fractionClass = 'green'; 
		
		} else if (percentageCorrect > 0.33) {

			fractionClass = 'yellow'; 

		} else {

			fractionClass = 'red'; 

		}

		return fractionClass;

	}

	_getRestartedGame() {

		const type = this._promptTypes.RESTART;

		const message = "Starting new game...";

		return (

			<span className={ type } key={ type }>{ message }</span>

		);

	}

	_getTotalCorrectAnswers(props) {

		return props.history.filter(turn => {

			const { randomLocation, selectedBorough } = turn;

			return twoBlocksUtils.answerIsCorrect(randomLocation, selectedBorough);

		}).length;

	}

	_isFirstPanoramaOfRestartedGame(props) {

		return props.totalGamesPlayed > 1;

	}

	/*----------  Public API  ----------*/
	
	getForProps(props) {

		let content = null;

		switch (props.stage) {

			case gameStages.PREGAME:

				content = this._getPregame(props);

				break;

			case gameStages.LOADING_PANORAMA:

				content = this._isFirstPanoramaOfRestartedGame(props)

					? this._getRestartedGame(props) 

					: this._getLoadingPanorama(props);

				break;

			case gameStages.SHOWING_PANORAMA:

				content = this._getShowingPanorama(props);

				break;

			case gameStages.GUESSING_LOCATION:

				content = this._getGuessingLocation(props);

				break;

			case gameStages.EVALUATING_ANSWER:

				content = this._getEvaluatingAnswer(props);

				break;

			case gameStages.POSTGAME:

				content = this._getPostgame(props);

				break;

		}

		return content;

	}

}
