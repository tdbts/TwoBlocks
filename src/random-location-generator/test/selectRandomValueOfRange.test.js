import { expect } from 'chai'; 
import selectRandomValueOfRange from '../selectRandomValueOfRange'; 

describe("selectRandomValueOfRange()", () => {
	
	describe("Interface", () => {
		
		it("Should be a function.", () => {
			
			expect(selectRandomValueOfRange).to.be.a('function'); 
		
		});
	
	});

	describe("Signature", () => {
		
		it("Should accept two arguments.", () => {
			
			expect(selectRandomValueOfRange.length).to.equal(2); 
		
		});
	
	});

	describe("Functionality", () => {
		
		const MIN = 0; 
		const MAX = 10; 

		const checkWithinRange = (randomValue, MIN, MAX) => ((MIN <= randomValue) && (randomValue <= MAX)); 

		it("Should select a random value within the given range.", () => {
			

			const randomValue = selectRandomValueOfRange(MIN, MAX); 

			const withinRange = checkWithinRange(randomValue, MIN, MAX);  

			expect(withinRange).to.equal(true); 
		
		});

		it("Should swap the arguments if they are out of order.", () => {
			
			const randomValue = selectRandomValueOfRange(MAX, MIN); 

			const withinRange = checkWithinRange(randomValue, MIN, MAX); 

			expect(withinRange).to.equal(true); 
		
		});

		it("Should return the given number if it is the same for both arguments.", () => {
			
			const SAME_NUMBER = 5; 

			const result = selectRandomValueOfRange(SAME_NUMBER, SAME_NUMBER); 

			expect(result).to.equal(SAME_NUMBER); 
		
		});
	
	});

	describe("Error handling.", () => {
		
		it("Should throw an error if either of the arguments is not a number.", () => {
			
			const passingInString = () => selectRandomValueOfRange(4, "8");

			const passingInObject = () => selectRandomValueOfRange({}, 4); 

			expect(passingInString).to.throw(Error); 
			expect(passingInObject).to.throw(Error); 
		
		});
	
	});

});
