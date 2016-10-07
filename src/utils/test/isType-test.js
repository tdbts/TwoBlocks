import isType from '../isType'; 

const chai = require('chai'); 
const expect = chai.expect;

describe('isType()', function () {
	
	it("Should reveal whether an entity is one of a given set of types.", function () {
		
		expect(isType(['array', 'boolean'], [1, 2])).to.equal(true); 
		expect(isType(['object', 'NaN'], 33)).to.equal(false); 
	
	});

	it("Should reveal whether an entity is an instance of a given type.", function () {
		
		expect(isType('object', {prop: 'yessir'})).to.equal(true); 
		expect(isType('number', 'hey')).to.equal(false); 
	
	});

	it("Should throw an error if an invalid type is given.", function () {
		const isTypeWithArrayContainingInvalidType = function () {
			return isType(['notAType', 'string'], 33); 
		}; 

		const isTypeWithStringWhichIsAnInvalidType = function () {
			return isType('notAType', 'hey'); 
		}; 

		expect(isTypeWithArrayContainingInvalidType).to.throw(Error); 
		expect(isTypeWithStringWhichIsAnInvalidType).to.throw(Error); 

	});

});
