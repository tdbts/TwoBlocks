import noUniqueBetweenSets from '../noUniqueBetweenSets';
import { expect } from 'chai'; 

describe('noUniqueBetweenSets()', () => {

	const testArrayA = ['a', 2, false]; 
	const testArrayB = [2, false, 'a'];
	const testArrayC = [2, 2, 'a', false, 'a'];  
	const testArrayD = [false, 'a', 2, 'nope']; 

	it("Should be a function.", () => {

		expect(noUniqueBetweenSets).to.be.a('function'); 

	});

	it("Should return true if every element in the first array has at least one matching element in the second array.", () => {

		expect(noUniqueBetweenSets(testArrayA, testArrayB)).to.equal(true); 
		expect(noUniqueBetweenSets(testArrayB, testArrayC)).to.equal(true); 

	}); 

	it("Should return false if there exists at least one unique element between the given sets.", () => {

		expect(noUniqueBetweenSets(testArrayA, testArrayD)).to.equal(false); 
		expect(noUniqueBetweenSets(testArrayC, testArrayD)).to.equal(false); 

	}); 

	it("Should return undefined if one or both of the given sets are not arrays.", () => {

		expect(noUniqueBetweenSets(testArrayB, false)).to.equal(void 0); 
		expect(noUniqueBetweenSets(null, null)).to.equal(void 0); 

	});
 
}); 
