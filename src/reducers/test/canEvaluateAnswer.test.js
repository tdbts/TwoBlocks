import { expect } from 'chai'; 
import canEvaluateAnswer from '../canEvaluateAnswer'; 
import actions from '../../actions/actions'; 

describe('canEvaluateAnswer()', () => {
	
	it("Should return 'true' if the action type is 'CAN_EVALUATE_ANSWER'.", () => {
		
		const type = actions.CAN_EVALUATE_ANSWER; 
		const action = { type }; 
		const result = canEvaluateAnswer(false, action); 

		expect(result).to.equal(true); 
	
	});

	it("Should return 'false' if the action type is 'CANNOT_EVALUATE_ANSWER'.", () => {
		
		const type = actions.CANNOT_EVALUATE_ANSWER; 
		const action = { type }; 
		const result = canEvaluateAnswer(true, action); 

		expect(result).to.equal(false); 
	
	});

	it("Should return the current state if passed an action it does not handle.", () => {
		
		const type = 'NONEXISTENT_ACTION'; 
		const action = { type }; 
		const shouldBeTrue = canEvaluateAnswer(true, action); 
		const shouldBeFalse = canEvaluateAnswer(false, action); 

		expect(shouldBeTrue).to.equal(true); 
		expect(shouldBeFalse).to.equal(false);  
	
	}); 

});
