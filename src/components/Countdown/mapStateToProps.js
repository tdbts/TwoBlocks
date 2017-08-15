export default state => {

	const { app, countdown } = state;

	const { isMobile } = app;
	const { timeLeft } = countdown;

	return { isMobile, timeLeft };

};
