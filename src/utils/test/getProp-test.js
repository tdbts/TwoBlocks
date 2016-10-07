import getProp from '../getProp'; 

const chai = require('chai'); 
const expect = chai.expect;	

describe('getProp()', function () {
	
	const testObj = {
		first: 'one'
	}; 

	it("Should return the value of an object's property.", function () {
		
		expect(getProp(testObj, 'first')).to.equal('one'); 		
	
	});

});
