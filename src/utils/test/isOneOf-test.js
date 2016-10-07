import isOneOf from '../isOneOf'; 

const chai = require('chai'); 
const expect = chai.expect;

describe('isOneOf()', function () {
	
	it("Should reveal whether the given item is contained in the given set.", function () {
		const possibilities = ['one', 'two', 'three']; 

		expect(isOneOf(possibilities, 'two')).to.equal(true); 
		expect(isOneOf(possibilities, 'four')).to.equal(false); 
	
	});

});
