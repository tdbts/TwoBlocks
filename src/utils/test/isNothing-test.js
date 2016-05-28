import isNothing from '../isNothing'; 

const chai = require('chai'); 
const expect = chai.expect;

describe('isNothing()', function () {
	
	it("Should reveal whether an item is null or undefined.", function () {
		
		expect(isNothing(null)).to.equal(true); 
		expect(isNothing(undefined)).to.equal(true); 
		expect(isNothing('str')).to.equal(false); 
		expect(isNothing('')).to.equal(false); 
		expect(isNothing([2, 3])).to.equal(false); 
	
	});

});
