import React from 'react'; 

const BoroughButtonsMobile = function BoroughButtonsMobile(props) {

	const { boroughButtonClassName, onTouchend, twoBlocksClass } = props; 

	return (	
	
		<div className={ twoBlocksClass }>
			<button className={ boroughButtonClassName } onClick={ () => onTouchend('Bronx') }>The Bronx</button>
			<button className={ boroughButtonClassName } onClick={ () => onTouchend('Manhattan') }>Manhattan</button>
			<button className={ boroughButtonClassName } onClick={ () => onTouchend('Queens') }>Queens</button>
			<button className={ boroughButtonClassName } onClick={ () => onTouchend('Brooklyn') }>Brooklyn</button>
			<button className={ boroughButtonClassName } onClick={ () => onTouchend('Staten Island') }>Staten Island</button>
		</div>
	
	); 

}; 

export default BoroughButtonsMobile; 
