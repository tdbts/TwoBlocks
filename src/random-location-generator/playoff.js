import { recurseUntilTrue } from '../utils/utils'; 

const playoff = function playoff(players, playOneRound, initializer) {

	if ((players.length % 2) !== 0) {

		throw new Error("There must be an even number of players passed to playoff()."); 

	}

	// Func 
	const process = players => {

		if (initializer) {

			players = initializer(players); 

		} 
		
		return playOneRound(players);  

	}; 

	// Condition 
	const onePlayerLeft = players => players.length === 1; 
	
	return recurseUntilTrue(process, onePlayerLeft, players); 


};

export default playoff; 
