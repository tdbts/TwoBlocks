import followPath from '../followPath'; 

const chai = require('chai'); 
const expect = chai.expect; 

describe('followPath()', () => {
	
	const testObj = {
		all: {
			my: {
				cats: "kick ass"
			}, 
			life: {
				is: "awesome"
			} 
		}
	};

	it("Should follow the given path within the given object and return the entity located at the terminus.", () => {

		expect(followPath(['all', 'life', 'is'], testObj)).to.equal(testObj.all.life.is); 
	
	});

	it("Should throw an error if the path tries to access a property of an entity which is not an object.", () => {
		
		const specifyingAnInvalidPath = () => {
			return followPath(['all', 'life', 'is', 'dope'], testObj); 
		}; 

		expect(specifyingAnInvalidPath).to.throw(Error); 
	
	});

	it("Should create an empty object where a property does not exist if upsert is truthy.", () => {
		
		followPath(['all', 'my', 'years'], testObj, {
			upsert: true
		}); 

		expect(testObj.all.my.years).to.be.an('object').and.to.be.empty; 
	
	});

	it("Should throw an error if the property does not exist and upsert is falsey.", () => {
		
		const specifyingANonexistentPathWithFalseyUpsert = () => {
			return followPath(['all', 'my', 'homies'], testObj); 
		}; 

		expect(specifyingANonexistentPathWithFalseyUpsert).to.throw(ReferenceError); 
	
	}); 

	it("Should modify the value of the final property of the path if a terminus function is included in the options.", () => {
			
		const addition = " all day every day"; 
		const originalValue = testObj.all.my.cats; 
		
		const terminus = (str) => {
			return str + addition; 
		}; 

		followPath(['all', 'my', 'cats'], testObj, { terminus }); 

		expect(testObj.all.my.cats).to.equal(originalValue + addition); 
	});

	it("Should modify the final property of the path even when 'upsert' is included in the options along with 'terminus'.", () => {
		
		const upsert = true; 

		const testString = 'are silly';
		
		const terminus = function () {
			return testString; 
		}; 

		followPath(['all', 'my', 'minions'], testObj, { terminus, upsert }); 

		expect(testObj.all.my.minions).to.equal(terminus()); 
	
	});

});
