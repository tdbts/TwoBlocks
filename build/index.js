import React from 'react';
import ReactDOM from 'react-dom';  

import twoBlocks from '../src/twoBlocks'; 

twoBlocks(); 

class Test extends React.Component {
	
	render() {
		return (
			<h1>It works!</h1>
		); 
	}

}

const test = document.getElementById('react-test'); 

ReactDOM.render(<Test />, test);
