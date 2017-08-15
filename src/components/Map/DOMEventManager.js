import { gameStages, heardKeys, keyEventMaps } from '../../constants/constants';
import { debounce, isOneOf } from '../../utils/utils';
import Borough from '../../game-components/Borough';

export default class MapDOMEventManager {

	constructor(mapComponent) {

		this._mapComponent = mapComponent;

		this.WINDOW_RESIZE_DEBOUNCE_TIMEOUT = 100;

	}

	_canSelectBoroughFromKeyPress(props) {

		const { 

			consideredBorough, 
			selectedBorough,
			stage, 
			submitted 

		} = props;

		return consideredBorough && !(submitted)

			&& (gameStages.GUESSING_LOCATION === stage)
			
			&& (!(selectedBorough) || (consideredBorough.getID() !== selectedBorough.getID()));

	}

	_canSubmitBoroughFromKeyPress(props) {

		const { 

			selectedBorough, 
			stage, 
			submitted 

		} = props;

		return selectedBorough && (!(submitted))

			&& (gameStages.GUESSING_LOCATION === stage);

	}

	_getBoroughIDFromKeyPress(key, props) {

		// Map only listens for arrow key presses 
		let boroughList = null;

		const { consideredBorough, selectedBorough } = props;

		const { arrowKeyHoverMap, firstArrowKeyPressBoroughMap } = keyEventMaps;		 

		if (consideredBorough) {

			const hoveredBoroughArrowMap = arrowKeyHoverMap[ consideredBorough.getID() ];

			boroughList = hoveredBoroughArrowMap[ key ]; 

		} else {

			boroughList = firstArrowKeyPressBoroughMap[ key ];

		}

		if (!(boroughList)) return;

		// Map can return multiple boroughs for a given key press.
		// If there is a selected borough already, ensure that the 
		// map does not return the selected borough, but rather, a 
		// borough "free" to be considered and selected.
		if (selectedBorough) {

			boroughList = boroughList.filter(id => id !== selectedBorough.getID());

		}

		if (boroughList.length < 1) return;

		const PRIORITY_INDEX = 0;

		return boroughList[PRIORITY_INDEX];		

	}

	_handleEnterKeyPress(props) {

		const { consideredBorough, setSelectedBorough, submitBorough } = props;

		if (this._canSelectBoroughFromKeyPress(props)) {

			setSelectedBorough(consideredBorough);
		
		} else if (this._canSubmitBoroughFromKeyPress(props)) {

			submitBorough();

		}


	}

	_onArrowPressConsiderBorough(e, props) {

		const { consideredBorough, selectedBorough, setConsideredBorough } = props;

		const boroughID = this._getBoroughIDFromKeyPress(e.key, props);

		// Key has no meaning relative to current considered borough
		if (!(boroughID)) return;

		// Ensure change in hovered borough
		if (consideredBorough && (boroughID === consideredBorough.getID())) return;

		// Don't style borough as considered if borough is selected 
		if (selectedBorough && (boroughID === selectedBorough.getID())) return;

		const geoJSON = this._mapComponent.getGeoJSON();

		if (!(geoJSON)) return;

		const borough = geoJSON

			.map(feature => new Borough(feature))

			.reduce((prev, curr) => {

				if (prev) return prev;

				return (boroughID === curr.getID()) ? curr : null;

			}, null);  // Start with null

		setConsideredBorough(borough);

	}

	_onWindowResize() {

		this._mapComponent.centerMaps();

	}

	/*----------  Public API  ----------*/

	assignListeners(props) {

		const onWindowResize = debounce(() => this._onWindowResize(), this.WINDOW_RESIZE_DEBOUNCE_TIMEOUT);

		window.addEventListener('resize', onWindowResize);

		if (!(props.isMobile)) {

			window.addEventListener('keydown', e => this.handleKeyDown(e));
		
		}

	}

	handleKeyDown(e) {

		const { props } = this._mapComponent;

		if (props.isMobile) return;  // Key presses only apply to desktop

		if (!(isOneOf(heardKeys, e.key))) return;  // Only react to key presses we're listening for. 

		e.preventDefault();  // Prevent arrows from scrolling page

		if ('Enter' === e.key) {

			this._handleEnterKeyPress(props);

		} else {

			this._onArrowPressConsiderBorough(e, props);

		}

	}
	
}
