function negate(action) {
	return function (...args) {
		return !(action.apply(this, args));
	};
}

export default negate; 
