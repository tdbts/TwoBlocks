export default function mapStateToProps(state) {

	const { app, gameplay } = state;

	const { isMobile } = app;

	const { currentTurn, stage } = gameplay;

	const { selectedBorough, submitted } = currentTurn;

	return {

		isMobile,
		selectedBorough,
		stage,
		submitted

	};

}
