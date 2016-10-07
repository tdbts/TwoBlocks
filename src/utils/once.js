// SOURCE: https://leanpub.com/javascriptallongesix/read 

// N.B: This will not work within constructors! 
// If used within a constructor's prototype, all 
// instances will have the same once function, 
// and the desired affect will not be achieved.  
const once = (fn) => {
	let hasRun = false;

	return function (...args) {
		if (hasRun) return;
    
		hasRun = true;
    
		return fn.apply(this, args);
	};

};

export default once; 
