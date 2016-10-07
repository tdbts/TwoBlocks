import truthyness from '../truthyness'; 

const chai = require('chai'); 
const expect = chai.expect;

describe('truthyness()', function () {
	
	it("Should reveal the truthyness of any item passed to it.", function () {
		
		expect(truthyness('three')).to.equal(true); 
		expect(truthyness({})).to.equal(true); 
		expect(truthyness(0)).to.equal(false); 
		expect(truthyness('')).to.equal(false); 
	
	});

});
