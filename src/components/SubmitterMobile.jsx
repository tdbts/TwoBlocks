import React from 'react'; 
import SubmitterDesktop from './SubmitterDesktop'; 

const SubmitterMobile = function SubmitterMobile(props) {

	const { borough, buttonClassName, buttonLabel, onClick, onTouchend, text,  twoBlocksClass } = props; 

	const mobileClassName = "two-blocks-button two-blocks-mobile-button borough-selection-button"; 

	const markup = borough 

		? <SubmitterDesktop 
			borough={ borough }
			buttonClassName={ buttonClassName }
			buttonLabel={ buttonLabel }
			text={ text }
			twoBlocksClass={ twoBlocksClass }
			onClick={ onClick }			
		  />  // eslint-disable-line no-mixed-spaces-and-tabs

		: (	<div className={ twoBlocksClass }>
				<button className={ mobileClassName } onClick={ () => onTouchend('Bronx') }>The Bronx</button>
				<button className={ mobileClassName } onClick={ () => onTouchend('Manhattan') }>Manhattan</button>
				<button className={ mobileClassName } onClick={ () => onTouchend('Queens') }>Queens</button>
				<button className={ mobileClassName } onClick={ () => onTouchend('Brooklyn') }>Brooklyn</button>
				<button className={ mobileClassName } onClick={ () => onTouchend('Staten Island') }>Staten Island</button>
			</div>
		  );  // eslint-disable-line no-mixed-spaces-and-tabs

	return markup; 
	
}; 

export default SubmitterMobile; 
