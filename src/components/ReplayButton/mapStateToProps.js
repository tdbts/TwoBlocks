export default state => {

	const { over, restarting, stage } = state.gameplay;

	return {

		restarting,
		stage,
		hidden: !(over)

	};

};
