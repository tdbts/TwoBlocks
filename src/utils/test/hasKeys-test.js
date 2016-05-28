import chai from 'chai'; 
import hasKeys from '../hasKeys'; 

const expect = chai.expect; 

/*=====================================
=            hasKeys Tests            =
=====================================*/

describe('hasKeys()', () => {
	
	describe('Interface', () => {
		
		it("Should be a function.", () => {
			
			expect(hasKeys).to.be.a('function'); 
		
		});

		it("Should accept two arguments.", () => {
			
			expect(hasKeys).to.have.length(2); 
		
		});
	
	}); 

	describe('Error Handling', () => {
		
		it("Should throw an error if the given keys are of an invalid type.", () => {
			
			const passingANumberAsTheDesiredKeys = () => {
				return hasKeys(80, {}); 
			}; 

			expect(passingANumberAsTheDesiredKeys).to.throw(TypeError); 
		
		});
	
	}); 

	describe('Functionality', () => {
		
		it("Should return a boolean representing whether the desired key(s) exist in the given object.", () => {
			
			const testObj = {
				'once': true, 
				'upon': 34, 
				'a': new Date(), 
				'time': null
			}; 

			expect(hasKeys('upon', testObj)).to.equal(true); 
			expect(hasKeys(['once', 'time'], testObj)).to.equal(true); 
			
			expect(hasKeys('nope', testObj)).to.equal(false); 
			expect(hasKeys(['nope', 'upon'], testObj)).to.equal(false); 
		
		});
	
	});

});

/*=====  End of hasKeys Tests  ======*/
