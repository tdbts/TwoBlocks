import getType from '../getType'; 

const chai = require('chai'); 
const expect = chai.expect;

describe('getType()', function () {
	const instance = new TestObj('one', 'two'); 

	function TestObj(first, second) {
		this.first = first; 
		this.second = second; 
	}

	it("Should return the type for any entity passed to it.", function () {
		
		expect(getType('str')).to.equal('string'); 
		expect(getType(3)).to.equal('number'); 
		expect(getType(false)).to.equal('boolean'); 
		expect(getType([1, 2])).to.equal('array'); 
		expect(getType({first: 'one'})).to.equal('object'); 
		expect(getType(null)).to.equal('null'); 
		expect(getType(undefined)).to.equal('undefined');
		expect(getType(/a|b/)).to.equal('regexp'); 
		expect(getType(NaN)).to.equal('NaN');  
		expect(getType(new Date())).to.equal('date'); 
		expect(getType(instance)).to.equal('object'); 
		expect(getType(new TypeError())).to.equal('error'); 
	
	});

});
