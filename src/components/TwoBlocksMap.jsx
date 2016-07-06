import React from 'react'; 

class TwoBlocksMap extends React.Component {

	componentDidUpdate(previousProps) {

		const { latLng, panorama, view } = this.props; 
		
		if (!(latLng) || !(panorama)) return; 

		if (latLng.equals(previousProps.latLng)) return;

		if ('map' === view) return; 

		panorama.setPosition(latLng); 

	}

	render() {

		return (

			<div id="twoBlocks-map" className="inherit-dimensions"></div>		
		
		); 

	}

} 

export default TwoBlocksMap; 
