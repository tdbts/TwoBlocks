const getViewLayerClassName = function getViewLayerClassName(twoBlocksClass, visible) {

	const visiblilityClass = visible ? 'visible' : 'offscreen'; 

	return [
		
			twoBlocksClass, 
			'inherit-dimensions', 
			'layered', 
			visiblilityClass

		]
		
		.join(' ')
		.trim(); 

}; 

export default getViewLayerClassName; 
