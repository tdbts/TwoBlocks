export default state => {

	const { gameplay } = state;

	const { selectedBorough } = gameplay.currentTurn;

	return {

		selectedBorough

	};

};
