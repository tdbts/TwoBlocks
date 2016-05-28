import clone from '../clone'; 

const chai = require('chai'); 
const expect = chai.expect; 

describe('clone()', function () {
	
	it("Should clone three simple types: string, number and boolean.", function () {
		
		const str = "hello"; 
		const num = 34; 
		const bool = true; 

		const strClone = clone(str); 
		const numClone = clone(num); 
		const boolClone = clone(bool); 

		expect(strClone).to.equal(str); 
		expect(numClone).to.equal(num); 
		expect(boolClone).to.equal(bool); 
	
	}); 

	it("Should clone NaN, null and undefined.", function () {
		
		const nan = NaN; 
		const nully = null; 
		const undef = undefined; 

		const nanClone = clone(nan); 
		const nullyClone = clone(nully); 
		const undefClone = clone(undef); 

		expect(nanClone !== nanClone).to.equal(nan !== nan); 
		expect(nullyClone).to.equal(nully); 
		expect(undefClone).to.equal(undef); 
	
	});

	it("Should clone dates.", function () {
		
		const date = new Date(); 

		const dateClone = clone(date); 

		expect(dateClone instanceof Date).to.equal(true); 
		expect(date.getTime()).to.equal(dateClone.getTime()); 
	
	});

	it("Should clone arrays.", function () {
		
		const arr = ['hello', 33, [1, 2]]; 

		const arrClone = clone(arr); 

		expect(arr === arrClone).to.equal(false);  
		expect(arrClone).to.deep.equal(arr); 
	
	});

	it("Should clone objects.", function () {
		
		const obj = {
			you: 'me', 
			one: 2, 
			nested: {
				hello: 'world'
			}
		}; 

		const objClone = clone(obj);   

		expect(obj === objClone).to.equal(false);   
		expect(objClone).to.deep.equal(obj);  
	
	});

});
