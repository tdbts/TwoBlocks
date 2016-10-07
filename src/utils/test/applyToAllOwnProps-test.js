import applyToAllOwnProps from '../applyToAllOwnProps'; 

const chai = require('chai'); 
const expect = chai.expect;  

describe('applyToAllOwnProps()', function () {
	'use strict'; 

	/*----------  setup  ----------*/
	let numbers;

	// Our action 
	function addOne(obj, prop) {
		obj[prop] = obj[prop] + 1;  
	}

	// Constructor that will create our object 
	// with own properties and prototype properties.  
	function NumbersObj(first, second) {
		this.first = first; 
		this.second = second; 
	}

	NumbersObj.prototype.third = 3; 

	// Reinstantiate numbers before each test 
	beforeEach(function () {
		numbers = new NumbersObj(1, 2); 
	});

	/*----------  tests  ----------*/
	it("Should apply an action to all own properties of an object.", function () {
		
		applyToAllOwnProps(addOne, numbers);  

		expect(numbers.first).to.equal(2); 
		expect(numbers.second).to.equal(3); 

	});

	it("Should not apply an action to a property that is not an own property.", function () {
		
		applyToAllOwnProps(addOne, numbers);  

		expect(numbers.third).to.not.equal(4); 
		expect(numbers.third).to.equal(3); 
	
	});

}); 
