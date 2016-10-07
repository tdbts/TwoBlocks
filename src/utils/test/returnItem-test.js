import returnItem from '../returnItem'; 

const chai = require('chai'); 
const expect = chai.expect;

describe('returnItem()', function () {
	
	it("Should turn an entity into a function that always returns that entity.", function () {
		const testArr = [1, 2, 3];
		const testFunc = returnItem(testArr); 
		const testObj = {
			prop: returnItem(testArr) 
		}; 

		expect(testFunc()).to.equal(testArr); 
		expect(testObj.prop()).to.equal(testArr); 

	});

});
