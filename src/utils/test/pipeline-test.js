import pipeline from '../pipeline'; 
import { expect } from 'chai'; 

describe('pipeline()', () => {
	
	it("Should be a function.", () => {
		
		expect(pipeline).to.be.a('function'); 
	
	});

	it("Should return a function.", () => {
		
		const testPipeline = pipeline([]); 

		expect(testPipeline).to.be.a('function'); 
	
	}); 

	it("Should pass a value through a series of functions and return the result.", () => {
		
		const addTwo = val => val + 2; 
		const multiplyBySix = val => val * 6; 

		const addTwoMultSix = pipeline(addTwo, multiplyBySix); 

		expect(addTwoMultSix(1)).to.equal(multiplyBySix(addTwo(1))); 
	
	});

	it("Should throw an error if the enclosed value is not an array of functions.", () => {
		
		const badPipeline = pipeline(32); 

		expect(() => badPipeline("nope")).to.throw(Error); 
	
	});

});

