import throwErrorIfTrue from '../throwErrorIfTrue'; 
import truthyness from '../truthyness';  

const chai = require('chai'); 
const expect = chai.expect;

describe('throwErrorIfTrue()', function () {
	
	it("Should throw an error if the given function performed on the given item is true.", function () {
		const testTruthynessOfNonEmptyString = function () {
			throwErrorIfTrue(truthyness, 'truthy'); 
		};

		expect(testTruthynessOfNonEmptyString).to.throw(Error); 
	
	});

	it("Should do nothing if the given function performed on the given item is not true.", function () {
		const testTruthynessOfFalse = function () {
			throwErrorIfTrue(truthyness, false); 
		}; 

		expect(testTruthynessOfFalse).to.not.throw(Error); 
	
	});

	it("Should throw the given type of error.", function () {
		const testTruthynessOfNonEmptyString = function () {
			throwErrorIfTrue(truthyness, 'truthy', new TypeError("Not the right type.")); 
		}; 

		expect(testTruthynessOfNonEmptyString).to.throw(TypeError); 
	
	});

});
