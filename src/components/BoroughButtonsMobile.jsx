import React from 'react'; 
import BoroughButton from './BoroughButton'; 

const BoroughButtonsMobile = function BoroughButtonsMobile(props) {

	const { onButtonClick, twoBlocksClass } = props; 

	const boroughButtonClassName = "two-blocks-button two-blocks-mobile-button borough-selection-button"; 

	const TRANSITION_TIMEOUT = 250; 

	return (	

		<div className={ twoBlocksClass }>
			<BoroughButton 
				boroughButtonClassName={ boroughButtonClassName } 
				boroughName={ 'Bronx' }
				id={ "first-borough-selection-button" }
				onButtonClick={ onButtonClick }
				transitionTimeout={ TRANSITION_TIMEOUT }
			/>
			<BoroughButton 
				boroughButtonClassName={ boroughButtonClassName } 
				boroughName={ 'Manhattan' }
				id={ "second-borough-selection-button" }
				onButtonClick={ onButtonClick }
				transitionTimeout={ TRANSITION_TIMEOUT }
			/>
			<BoroughButton 
				boroughButtonClassName={ boroughButtonClassName } 
				boroughName={ 'Queens' }
				id={ "third-borough-selection-button" }
				onButtonClick={ onButtonClick }
				transitionTimeout={ TRANSITION_TIMEOUT }
			/>
			<BoroughButton 
				boroughButtonClassName={ boroughButtonClassName } 
				boroughName={ 'Brooklyn' }
				id={ "fourth-borough-selection-button" }
				onButtonClick={ onButtonClick }
				transitionTimeout={ TRANSITION_TIMEOUT }
			/>
			<BoroughButton 
				boroughButtonClassName={ boroughButtonClassName } 
				boroughName={ 'Staten Island' }
				id={ "fifth-borough-selection-button" }
				onButtonClick={ onButtonClick }
				transitionTimeout={ TRANSITION_TIMEOUT }
			/>												
		</div>
	
	
	); 

}; 

/*----------  Define Proptypes  ----------*/

BoroughButtonsMobile.propTypes = {

	onButtonClick: React.PropTypes.func.isRequired, 
	twoBlocksClass: React.PropTypes.string.isRequired

}; 

export default BoroughButtonsMobile; 
