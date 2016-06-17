import React from 'react';
import twoBlocks from '../twoBlocks'; 

class TwoBlocks extends React.Component {

	componentDidMount() {
	    
	    twoBlocks();   
	
	}

	render() {

		return (
	
			<div id="canvas-streetviewpanorama"></div>
	
		); 

	}

}

export default TwoBlocks; 
