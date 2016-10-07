import { expect } from 'chai'; 
import invoke from '../invoke'; 

describe('invoke', () => {
	
	const obj = {
		fail: 31,
		test() {
			return "TEST"; 
		}
	}; 

	it("Should invoke the given method of the object.", () => {
		
		expect(invoke(obj, 'test')).to.equal(obj.test()); 
	
	}); 

	it("Should return undefined if the given method name is not a function.", () => {
		
		expect(invoke(obj, 'fail')).to.be.undefined; 
	
	}); 

	it("Should return undefined if either argument is falsey.", () => {
		
		expect(invoke(obj, 0)).to.be.undefined; 
		expect(invoke(false, 'test')).to.be.undefined; 
		expect(invoke(null, null)).to.be.undefined; 
	
	});

});
