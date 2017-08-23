import { lifecycle, gameStages } from '../../constants/constants';

export default class MapUpdateManager {

	constructor(mapComponent) {

		this._mapComponent = mapComponent;

	}

	_checkCanShowAnswer(props) {

		const { 

			isMobile, 
			prompt,
			showAnswer,
			showingAnswer, 
			stage 

		} = props;

		const { BEFORE, AFTER } = lifecycle;

		// On mobile devices, show answer in the 'EVALUATING_ANSWER' stage, 
		// after prompt has completed displaying.
		if (!(isMobile) || (gameStages.EVALUATING_ANSWER !== stage) || (BEFORE !== showingAnswer) || (AFTER !== prompt.displaying)) return;

		showAnswer();

	}

	_checkConsideredBorough(props, prevProps) {

		const { GUESSING_LOCATION } = gameStages;

		const { consideredBorough: prevConsideredBorough } = prevProps;

		const { 

			consideredBorough, 
			isMobile, 
			selectedBorough, 
			stage 

		} = props; 

		// Styling only applies to desktop map in 'GUESSING_LOCATION' stage.
		// Dont' apply styling if considered borough has not changed.
		if (isMobile || (GUESSING_LOCATION !== stage) || (prevConsideredBorough && consideredBorough && (prevConsideredBorough.getID() === consideredBorough.getID()))) return;

		if (prevConsideredBorough && (!(selectedBorough) || (selectedBorough.getID() !== prevConsideredBorough.getID()))) {

			this._mapComponent.unconsiderBorough(prevConsideredBorough);
		
		}

		if (consideredBorough) {

			this._mapComponent.considerBorough(consideredBorough);

		}

	}
	
	_checkGameStageChanges(props, prevProps) {

		const { stage: prevStage } = prevProps;

		if (prevStage === props.stage) return;

		this._mapComponent.handleGameStage();

	}

	_checkGeoJSON(props, prevProps) {

		const { geoJSON: prevGeoJSON } = prevProps;

		const { geoJSON, isMobile } = props;

		if (isMobile || prevGeoJSON || !(geoJSON)) return;

		this._mapComponent.addGeoJSON(geoJSON);

	}

	_checkHoveredBorough(props, prevProps) {

		const { hoveredBorough: prevHoveredBorough } = prevProps;

		const { clearConsideredBorough, hoveredBorough, setConsideredBorough } = props;

		if (prevHoveredBorough && hoveredBorough && (prevHoveredBorough.getID() === hoveredBorough.getID())) return;

		if (hoveredBorough) {

			setConsideredBorough(hoveredBorough);

		} else if (prevHoveredBorough) {

			clearConsideredBorough();

		}

	}

	_checkLibrariesLoaded(props, prevProps) {

		const { librariesLoaded: prevLibrariesLoaded } = prevProps;

		const { librariesLoaded } = props;

		if (librariesLoaded === prevLibrariesLoaded) return;

		if (librariesLoaded && this._mapComponent.allMapsAreMounted()) {

			this._mapComponent.createMaps();

			this._mapComponent.createShowLocationMarker();

		}

	}
	
	_checkRandomLocation(props, prevProps) {

		const { randomLocation: prevRandomLocation } = prevProps;

		const { randomLocation } = props;

		if ((prevRandomLocation === randomLocation) || !(randomLocation)) return;

		const { lat, lng } = randomLocation;

		const { BLOCK, BOROUGH } = this._mapComponent.mapLevels;

		this._mapComponent.getMaps().setCenter(lat, lng, BLOCK);
		this._mapComponent.getMaps().setCenter(lat, lng, BOROUGH);

	}

	_checkSelectedBorough(props, prevProps) {

		const { selectedBorough: prevSelectedBorough } = prevProps;

		const { isMobile, selectedBorough } = props;
	
		// Styling only applies to desktop map
		if (isMobile || (prevSelectedBorough && selectedBorough && prevSelectedBorough.getID() === selectedBorough.getID())) return;

		if (prevSelectedBorough) {

			this._mapComponent.unselectBorough(prevSelectedBorough);

		}

		if (selectedBorough) {

			this._mapComponent.selectBorough(selectedBorough);		
		
		}

	}

	_checkShowingAnswer(props, prevProps) {

		const { showingAnswer, setMapLevelCity } = props;
		const { showingAnswer: prevShowingAnswer } = prevProps;

		const { DURING, AFTER } = lifecycle;

		if ((prevShowingAnswer === showingAnswer)) return;

		if (DURING === showingAnswer) {

			this._mapComponent.showAnswer();
		
		} else if (AFTER === showingAnswer) {
		
			setMapLevelCity();

		}

	}

	/*----------  Public API  ----------*/
	
	handleUpdate(props, prevProps) {

		this._checkCanShowAnswer(props, prevProps);

		this._checkConsideredBorough(props, prevProps);

		this._checkGameStageChanges(props, prevProps);

		this._checkGeoJSON(props, prevProps);

		this._checkHoveredBorough(props, prevProps);

		this._checkLibrariesLoaded(props, prevProps);

		this._checkRandomLocation(props, prevProps);

		this._checkSelectedBorough(props, prevProps);		

		this._checkShowingAnswer(props, prevProps);

	}

}
