const isNumeric = function isNumeric(n) {
  
	return !(isNaN(parseFloat(n))) && isFinite(n);

}; 

export default isNumeric; 
