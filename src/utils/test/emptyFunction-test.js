import emptyFunction from '../emptyFunction'; 

const chai = require('chai'); 
const expect = chai.expect; 

describe('emptyFunction()', function () {
	
	it("Should return an empty function.", function () {
		
		const emptyFunc = emptyFunction(); 

		expect(emptyFunc).to.be.a('function'); 
		expect(emptyFunc).to.have.length(0); 
		expect(emptyFunc()).to.equal(undefined); 
	
	});

}); 
