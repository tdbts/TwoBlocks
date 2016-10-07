import length from './length'; 

const extend = (o, modifications, ...rest) => {

	if (length(rest) > 0) {
		const extension = extend(o, modifications); 
		const args = rest; 

		args.unshift(extension); 

		return extend.apply(this, args); 
	}

	const F = function () {}; 

	if (modifications) {
		for (const prop in modifications) {
			o[prop] = modifications[prop]; 
		} 
	}
	
	F.prototype = o;
 
	return new F();
}; 

export default extend;
