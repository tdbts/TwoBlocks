import isSomething from '../isSomething'; 

const chai = require('chai'); 
const expect = chai.expect;

describe('isSomething()', function () {
	
	it("Should reveal whether an item is not null or undefined.", function () {
		
		expect(isSomething('the force')).to.equal(true); 
		expect(isSomething(null)).to.equal(false); 
		expect(isSomething(undefined)).to.equal(false); 
	
	});

});
