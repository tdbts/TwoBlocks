const headToHeadMatchups = function headToHeadMatchups(players, playGame) {

	const winners = []; 

	let i = 0; 

	while (i < (players.length / 2)) {

		// Play game with first and last player, second and 
		// second-to-last player, and so on...
		const winner = playGame(players[i], players[players.length - (i + 1)]); 

		winners.push(winner); 

		i += 1; 

	}

	return winners; 

}; 

export default headToHeadMatchups; 
