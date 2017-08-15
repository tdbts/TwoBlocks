import { gameStages, lifecycle } from '../../constants/constants';

export default {

	_viewPregameIsComplete(props) {

		return lifecycle.AFTER === props.prompt.displaying;

	},

	_viewLoadingPanoramaIsComplete(props) {

		return lifecycle.AFTER === props.prompt.displaying;

	},

	_viewShowingPanoramaIsComplete(props) {

		const { panorama } = props;

		return (lifecycle.AFTER === panorama.displayingLocation);

	},

	// We know that 'submitted' is tied to the view.  Once the answer 
	// has been submitted, we can assume the view is complete.

	_viewGuessingLocationIsComplete(props) {

		const { gameplay, prompt } = props;

		const { currentTurn } = gameplay;

		return currentTurn.submitted && (lifecycle.AFTER === prompt.displaying);

	},

	_viewEvaluatingAnswerIsComplete(props) {

		const { maps } = props;

		return (lifecycle.AFTER === maps.showingAnswer);

	},

	// We know that 'over' is tied to the replay button being clicked.
	 
	_viewPostgameIsCompete(props) {

		return !(props.gameplay.over);

	},	

	/*----------  Public API  ----------*/

	isComplete(props) {

		let result = null;

		switch (props.gameplay.stage) {

			case gameStages.PREGAME:

				result = this._viewPregameIsComplete(props);

				break;

			case gameStages.LOADING_PANORAMA:

				result = this._viewLoadingPanoramaIsComplete(props);

				break;

			case gameStages.SHOWING_PANORAMA:

				result = this._viewShowingPanoramaIsComplete(props);

				break;

			case gameStages.GUESSING_LOCATION:

				result = this._viewGuessingLocationIsComplete(props);

				break;

			case gameStages.EVALUATING_ANSWER:

				result = this._viewEvaluatingAnswerIsComplete(props);

				break;

			case gameStages.POSTGAME:

				result = this._viewPostgameIsCompete(props);

				break;

		}
		
		return result;

	}

};
