import getOwnProp from '../getOwnProp'; 

const chai = require('chai'); 
const expect = chai.expect; 

describe('getOwnProp()', function () {
	const instance = new TestObj('hey', 'ho'); 

	function TestObj(first, second) {
		this.first = first; 
		this.second = second; 
	}

	TestObj.prototype.third = 3; 

	it("Should return the value of an own property.", function () {
		
		expect(getOwnProp(instance, 'first')).to.equal('hey'); 	
	
	});

	it("Should not return the value of a property if it is not an own property.", function () {
		
		expect(getOwnProp(instance, 'third')).to.equal(undefined); 
	
	});

	it("Should throw an error if the property does not exist in the object provided.", function () {
		const accessingANonexistentProperty = function () {
			return getOwnProp(instance, 'notThere'); 
		}; 

		expect(accessingANonexistentProperty).to.throw(Error); 
	
	});

});
