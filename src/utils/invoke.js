import isType from './isType'; 

/*==============================
=            invoke()            =
==============================*/

const invoke = (obj, method) => {
	if (obj && method && isType('function', obj[method])) {
		return obj[method](); 
	}
};

/*=====  End of invoke()  ======*/

export default invoke; 
