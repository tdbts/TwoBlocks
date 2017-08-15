export default state => {

	const { app, gameplay, maps, panorama, prompt } = state;

	const { initialization, isMobile } = app;

	const { librariesLoaded } = initialization;

	const { currentTurn, stage } = gameplay;

	const { showingAnswer } = maps;

	const { created, displayingLocation, visible } = panorama;

	const { randomLocation } = currentTurn;

	return {
		created,
		isMobile,
		// Must keep the distinction between:
			// 'SHOWING_LOCATION' game stage, versus 
			// 'displayingLocation', versus
			// 'visible'
		// N.B. - 'displaying' vs. 'SHOWING_LOCATION' game stage: 
		// Even though the game stage may be 'SHOWING_LOCATION', and the 
		// panorama visible, the panorama itself might not be "displaying" 
		// the location for the player (for instance, in mobile where the 
		// prompt needs to first indicate the new game stage to the player 
		// before moving out of view in order to show the panorama and start
		// the countdown). 
		displayingLocation,
		librariesLoaded,
		prompt,
		randomLocation,
		showingAnswer,
		stage,
		visible
	};

};
