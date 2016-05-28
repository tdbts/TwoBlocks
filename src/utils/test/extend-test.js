import extend from '../extend'; 

const chai = require('chai'); 
const expect = chai.expect; 

describe('extend()', function () {
	
	let base; 

	beforeEach(function () {
		base = {
			prop: 33, 
			getVal() {
				return this.prop; 
			}
		}; 
	});

	it("Should, given an object, return a new object whose prototype is deeply equal to the passed-in object.", function () {
		
		const extension = extend(base); 

		expect(extension).to.have.a.property('prop'); 
		expect(extension.prop).to.equal(33); 
		expect(extension).to.have.a.property('getVal'); 
		expect(extension.getVal()).to.equal(33); 
		expect(extension).to.not.equal(base); 
		expect(base.isPrototypeOf(extension)).to.equal(true); 
	});

	it("Should apply modifications to a given object.", function () {
		
		const extension = extend(base, {
			hey: 'ho', 
			getVal() {
				return this.prop + 1; 
			}
		}); 

		expect(extension).to.have.a.property('hey'); 
		expect(extension.hey).to.equal('ho'); 
		expect(extension).to.have.a.property('getVal'); 
		expect(extension.getVal()).to.equal(34); 
	
	}); 

	it("Should recursively extend objects passed to it.", function () {
		const objA = {
			prop: 100
		}; 

		const objB = {
			finalField: 'yep', 
			getVal() {
				return this.prop + 50; 
			}
		}; 

		const extension = extend({}, base, objA, objB); 

		expect(extension).to.have.a.property('finalField'); 
		expect(extension.finalField).to.equal(objB.finalField); 
		expect(extension.getVal()).to.equal(150); 
	
	});
 
}); 
