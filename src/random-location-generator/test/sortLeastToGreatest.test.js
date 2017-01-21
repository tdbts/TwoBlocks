import { expect } from 'chai'; 
import sortLeastToGreatest from '../sortLeastToGreatest'; 

describe("sortLeastToGreatest()", () => {
	
	describe("Entity", () => {
		
		it("Should be a function.", () => {
			
			expect(sortLeastToGreatest).to.be.a('function'); 
		
		});

	});

	describe("Signature", () => {
		
		it("Should accept one argument.", () => {
			
			expect(sortLeastToGreatest.length).to.equal(1); 
		
		});
	
	});

	describe("Functionality", () => {

		const testNumbers = [3, 2, 1]; 
		
		const sortedNumbers = sortLeastToGreatest(testNumbers); 
		
		it("Should sort numbers from least to greatest.", () => {
			
			expect(sortedNumbers.length).to.equal(3);
			expect(sortedNumbers.reverse()).to.deep.equal(testNumbers); 
		
		});

		it("Should not modify the original array.", () => {
			
			expect(sortedNumbers).to.not.equal(testNumbers); 
		
		});
	
	});

	describe("Error handling.", () => {
		
		it("Should throw an error if not passed an array.", () => {
			
			const passingBoolean = () => sortLeastToGreatest(false); 

			const passingObject = () => sortLeastToGreatest({}); 

			const passingString = () => sortLeastToGreatest("nope"); 

			expect(passingBoolean).to.throw(Error); 
			expect(passingObject).to.throw(Error); 
			expect(passingString).to.throw(Error); 
		
		});

		it("Should throw an error if an element of the array is not a number.", () => {
			
			const arrayWithNonNumbers = [1, 2, false, []]; 

			const sortingArrayWithNonNumbers = () => sortLeastToGreatest(arrayWithNonNumbers); 

			expect(sortingArrayWithNonNumbers).to.throw(Error); 
		
		});
	
	});
	
});

