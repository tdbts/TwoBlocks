import chai from 'chai'; 
import existenceCheck from '../existenceCheck'; 

const expect = chai.expect; 

/*============================================
=            existenceCheck Tests            =
============================================*/

describe('existenceCheck()', () => {

	const testObj = {
		'my': {
			'existing': {
				'property': 33
			}
		}
	}; 

	it("Should return true if a property exists in the given object.", () => {

		expect(existenceCheck(['my', 'existing', 'property'], testObj)).to.equal(true); 
		expect(existenceCheck(['my', 'existing'], testObj)).to.equal(true); 

	});

	it("Should return false if a property does not exist in the given object.", () => {

		expect(existenceCheck(['my', 'nonexistent', 'property'], testObj)).to.equal(false); 

	});

	it("Should throw an error if no properties are passed on invocation.", () => {

		const passingNoPropertiesOnInvocation = () => existenceCheck(testObj); 

		expect(passingNoPropertiesOnInvocation).to.throw(Error); 

	});		

	it("Should throw an error if the entity passed for the properties parameter is not a string or object.", () => {
		
		const passingANumberAsProperties = () => existenceCheck(356, testObj); 
		const passingAnObjectAsProperties = () => existenceCheck({}, testObj); 

		expect(passingANumberAsProperties).to.throw(Error); 
		expect(passingAnObjectAsProperties).to.throw(Error); 
	
	});

}); 

/*=====  End of existenceCheck Tests  ======*/
