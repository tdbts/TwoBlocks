import typeIsValid from '../typeIsValid'; 

const chai = require('chai'); 
const expect = chai.expect;

describe('typeIsValid()', function () {
	
	it("Should reveal whether a given type is a valid type.", function () {
		
		expect(typeIsValid('string')).to.equal(true); 
		expect(typeIsValid('date')).to.equal(true); 
		expect(typeIsValid('gonzo')).to.equal(false); 
	
	});

});
