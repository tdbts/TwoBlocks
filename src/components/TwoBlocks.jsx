import React from 'react';
import twoBlocks from '../twoBlocks'; 

class TwoBlocks extends React.Component {

	componentDidMount() {
	    
	    twoBlocks();   
	
	}

	render() {

		return (
	
			<div id="twoBlocks"></div>
	
		); 

	}

}

export default TwoBlocks; 
