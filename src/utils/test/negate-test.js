import negate from '../negate'; 
import isType from '../isType'; 

const chai = require('chai'); 
const expect = chai.expect;

describe('negate()', function () {
	const isString = function isString(item) {
		return isType('string', item); 
	};
	const isNotString = negate(isString);

	it("Should return a function.", function () {
		
		expect(isNotString).to.be.a('function'); 
	
	}); 

	it("Should negate the result of the given function.", function () {
		const str = 'cheese'; 

		expect(isString(str)).to.equal(true); 
		expect(isNotString(str)).to.equal(false); 
		expect(isNotString(false)).to.equal(true); 
	
	});

});
