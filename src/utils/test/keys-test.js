import keys from '../keys'; 

const chai = require('chai'); 
const expect = chai.expect;

describe('keys()', function () {
	
	it("Should return the keys for a given object.", function () {
		const testObj = {
			first: 'one', 
			second: 'two'
		}; 

		const result = keys(testObj); 

		expect(result).to.be.an('array'); 
		expect(result).to.include('first'); 
		expect(result).to.include('second'); 
	
	});

});
