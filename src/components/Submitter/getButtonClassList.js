export default selectedBorough => {

	return [
	
		'two-blocks-submitter-button', 
		'two-blocks-button', 
		selectedBorough ? "" : "hidden"

	].join(" ").trim(); 

};
