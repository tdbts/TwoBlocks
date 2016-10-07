const getViewLayerClassName = function getViewLayerClassName() {

	const visiblilityClass = this.props.visible ? 'visible' : 'hidden'; 

	return [
		
			this.props.twoBlocksClass, 
			'inherit-dimensions', 
			'layered', 
			visiblilityClass

		]
		
		.join(' ')
		.trim(); 

}; 

export default getViewLayerClassName; 
