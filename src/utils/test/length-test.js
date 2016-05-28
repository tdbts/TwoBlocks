import length from '../length'; 

const chai = require('chai'); 
const expect = chai.expect;

describe('length()', function () {
	
	it("Should return the length of an array.", function () {
		
		expect(length([1, 2, 3])).to.equal(3); 
	
	});

	it("Should return the length of a string.", function () {
		
		expect(length('happy')).to.equal(5); 
	
	});

	it("Should return the length of a function.", function () {
		function testFuncA(first, second) {
			return [first, second];
		} 

		function testFuncB() {
			return "nada";
		} 

		expect(length(testFuncA)).to.equal(2); 
		expect(length(testFuncB)).to.equal(0); 
	
	});

	it("Should return the length of an object.", function () {
		const testObj = {
			first: 'one', 
			second: 'two'
		}; 

		expect(length(testObj)).to.equal(2); 
	
	});

});
