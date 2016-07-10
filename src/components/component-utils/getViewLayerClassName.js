const getViewLayerClassName = function getViewLayerClassName() {

	const visiblilityClass = this.props.visible ? 'visible' : 'hidden'; 

	return ['inherit-dimensions', 'layered', visiblilityClass].join(' ').trim(); 

}; 

export default getViewLayerClassName; 
