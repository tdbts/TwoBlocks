export default state => {

	const { currentTurn, stage } = state.gameplay;

	const { selectedBorough } = currentTurn;

	return { selectedBorough, stage };

};
