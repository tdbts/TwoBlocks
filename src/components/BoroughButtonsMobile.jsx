import React from 'react'; 
import BoroughButton from './BoroughButton'; 

const BoroughButtonsMobile = function BoroughButtonsMobile(props) {

	const { onButtonClick, selectedBorough, showButtons, twoBlocksClass } = props; 

	const boroughButtonClassName = "two-blocks-button two-blocks-mobile-button borough-selection-button"; 

	const classList = getRootClassList(selectedBorough, twoBlocksClass); 

	const TRANSITION_TIMEOUT = 250; 

	return (	

		showButtons 

		? 	<div className={ classList }>
				<BoroughButton 
					boroughButtonClassName={ boroughButtonClassName } 
					boroughName={ 'Bronx' }
					isSelected={ selectedBorough === 'The Bronx' }
					onButtonClick={ onButtonClick }
					orderClass={ "first-borough-selection-button" }
					transitionTimeout={ TRANSITION_TIMEOUT }
				/>
				<BoroughButton 
					boroughButtonClassName={ boroughButtonClassName } 
					boroughName={ 'Manhattan' }
					isSelected={ selectedBorough === 'Manhattan' }
					onButtonClick={ onButtonClick }
					orderClass={ "second-borough-selection-button" }
					transitionTimeout={ TRANSITION_TIMEOUT }
				/>
				<BoroughButton 
					boroughButtonClassName={ boroughButtonClassName } 
					boroughName={ 'Queens' }
					isSelected={ selectedBorough === 'Queens' }
					onButtonClick={ onButtonClick }
					orderClass={ "third-borough-selection-button" }
					transitionTimeout={ TRANSITION_TIMEOUT }
				/>
				<BoroughButton 
					boroughButtonClassName={ boroughButtonClassName } 
					boroughName={ 'Brooklyn' }
					isSelected={ selectedBorough === 'Brooklyn' }
					onButtonClick={ onButtonClick }
					orderClass={ "fourth-borough-selection-button" }
					transitionTimeout={ TRANSITION_TIMEOUT }
				/>
				<BoroughButton 
					boroughButtonClassName={ boroughButtonClassName } 
					boroughName={ 'Staten Island' }
					isSelected={ selectedBorough === 'Staten Island' }
					onButtonClick={ onButtonClick }
					orderClass={ "fifth-borough-selection-button" }
					transitionTimeout={ TRANSITION_TIMEOUT }
				/>												
			</div>
	
			: null 

	); 

};

/*----------  getRootClassList()  ----------*/

const getRootClassList = function getRootClassList(selectedBorough, twoBlocksClass) {
 
	return [ 
	
		twoBlocksClass, 
		selectedBorough ? 'borough-selected' : '' 
	
	].join(" ").trim(); 

}; 


/*----------  Define Proptypes  ----------*/

BoroughButtonsMobile.propTypes = {

	onButtonClick: React.PropTypes.func.isRequired,
	selectedBorough: React.PropTypes.string, 
	showButtons: React.PropTypes.bool,
	twoBlocksClass: React.PropTypes.string.isRequired

}; 

export default BoroughButtonsMobile; 
