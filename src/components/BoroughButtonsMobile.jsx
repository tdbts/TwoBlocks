import React from 'react'; 

const BoroughButtonsMobile = function BoroughButtonsMobile(props) {

	const { onButtonClick, twoBlocksClass } = props; 

	const boroughButtonClassName = "two-blocks-button two-blocks-mobile-button borough-selection-button"; 

	return (	
	
		<div className={ twoBlocksClass }>
			<button className={ boroughButtonClassName } onClick={ () => onButtonClick('Bronx') }>The Bronx</button>
			<button className={ boroughButtonClassName } onClick={ () => onButtonClick('Manhattan') }>Manhattan</button>
			<button className={ boroughButtonClassName } onClick={ () => onButtonClick('Queens') }>Queens</button>
			<button className={ boroughButtonClassName } onClick={ () => onButtonClick('Brooklyn') }>Brooklyn</button>
			<button className={ boroughButtonClassName } onClick={ () => onButtonClick('Staten Island') }>Staten Island</button>
		</div>
	
	); 

}; 

/*----------  Define Proptypes  ----------*/

BoroughButtonsMobile.propTypes = {

	onButtonClick: React.PropTypes.func.isRequired, 
	twoBlocksClass: React.PropTypes.string.isRequired

}; 

export default BoroughButtonsMobile; 
