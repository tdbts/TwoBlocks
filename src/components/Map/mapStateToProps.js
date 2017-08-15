export default state => {

	const { app, gameplay, maps, prompt } = state;

	const { librariesLoaded } = app.initialization;

	const { isMobile } = app;
	
	const { stage } = gameplay;

	const { 
	
		hoveredBorough, 
		level, 
		showingAnswer, 
		visible 

	} = maps;

	const { 

		consideredBorough, 
		randomLocation, 
		selectedBorough,
		submitted
	
	} = gameplay.currentTurn;

	return {

		consideredBorough,
		gameplay,
		hoveredBorough,
		isMobile,
		level,
		librariesLoaded,
		prompt,
		randomLocation,
		selectedBorough,
		showingAnswer,
		stage,
		submitted,
		visible

	};

};
