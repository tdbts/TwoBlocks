import getArgumentsArray from '../getArgumentsArray'; 

const chai = require('chai'); 
const expect = chai.expect; 

describe('getArgumentsArray()', function () {

	it("Should return arguments in an array.", function () {
		const tester = function () {
			return getArgumentsArray(arguments);
		};
		const args = tester('hey', 'ho', 33, false); 

		expect(args).to.be.an('array');
		expect(args[0]).to.equal('hey'); 
		expect(args[3]).to.equal(false);  
	
	});

	it("Should slice the arguments array if additional arguments are provided.", function () {
		const testerA = function () {
			return getArgumentsArray(arguments, 2); 
		}; 
		const argsA = testerA('hey', 'ho', 33, false); 
		
		const testerB = function () {
			return getArgumentsArray(arguments, 0, -1); 
		};
		const argsB = testerB('will', 'work', 4, 'food');

		expect(argsA).to.be.an('array'); 
		expect(argsA.length).to.equal(2); 
		expect(argsA[0]).to.equal(33); 

		expect(argsB).to.be.an('array'); 
		expect(argsB.length).to.equal(3); 
		expect(argsB[2]).to.equal(4); 
	
	});

	it("Should still work if no start value is passed in on invocation.", function () {
		
		const tester = function () {
			return getArgumentsArray(arguments, null, 2); 
		};
		const args = tester('hey', 'ho', 33, false);

		expect(args).to.be.an('array'); 
		expect(args.length).to.equal(2); 
		expect(args[1]).to.equal('ho'); 		
	
	});

});
