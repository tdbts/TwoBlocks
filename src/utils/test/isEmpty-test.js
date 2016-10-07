import isEmpty from '../isEmpty'; 

const chai = require('chai'); 
const expect = chai.expect;

describe('isEmpty()', function () {
	
	it('Should reveal whether an array is empty.', function () {
		const testArray = []; 

		expect(isEmpty(testArray)).to.equal(true); 

		testArray.push('something'); 

		expect(isEmpty(testArray)).to.equal(false); 
	
	});

	it("Should reveal whether a string is empty.", function () {
		
		let testString = ''; 

		expect(isEmpty(testString)).to.equal(true); 

		testString = 'hello there'; 

		expect(isEmpty(testString)).to.equal(false); 
	
	});

	it("Should reveal whether an object is empty.", function () {
		
		const testObj = {}; 
	
		expect(isEmpty(testObj)).to.equal(true); 

		testObj.something = 'here'; 

		expect(isEmpty(testObj)).to.equal(false); 

	}); 

	it("Should throw an error if an attempt is made to use isEmpty on an incompatible data type.", function () {
		
		const applyingIsEmptyToAnUndefined = function () {
			return isEmpty(undefined); 
		}; 

		expect(applyingIsEmptyToAnUndefined).to.throw(Error); 
	
	});

});
