import noArguments from '../noArguments'; 

const chai = require('chai'); 
const expect = chai.expect;

describe('noArguments()', function () {
	
	it("Should reveal whether a function has been passed zero arguments.", function () {
		
		const testFunc = function () {
			return noArguments(arguments); 
		};

		expect(testFunc()).to.equal(true); 
		expect(testFunc('a', 'b', 'c')).to.equal(false); 
	
	});

});
