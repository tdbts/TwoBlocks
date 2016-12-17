const stylizeBoroughName = function stylizeBoroughName(boroughName) {

	if ('Bronx' !== boroughName) return boroughName; 

	return `The ${boroughName}`; 

}; 

export default stylizeBoroughName; 
