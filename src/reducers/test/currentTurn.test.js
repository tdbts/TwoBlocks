import { expect } from 'chai'; 
import currentTurn from '../currentTurn'; 
import actions from '../../actions/actions'; 

const testTurns = {
	CURRENT: {
		some: 'property', 
		selectedBorough: 'Bronx'
	}, 
	NEXT: {
		some: null, 
		selectedBorough: null
	}
}; 

describe('currentTurn()', () => {
	
	it("Should return 'null' if the action type is 'CLEAR_CURRENT_TURN'.", () => {
		
		const type = actions.CLEAR_CURRENT_TURN; 
		const action = { type }; 
		const newState = currentTurn(testTurns.CURRENT, action); 

		expect(newState).to.equal(null); 
	
	});

	it("Should return the turn object given on invocation if the action type is 'NEXT_TURN'.", () => {
		
		const type = actions.NEXT_TURN; 
		const action = { type, turn: testTurns.NEXT };
		const newState = currentTurn(null, action);

		expect(newState).to.equal(testTurns.NEXT);   
	
	});

});