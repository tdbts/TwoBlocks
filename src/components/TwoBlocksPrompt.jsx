import React from 'react'; 
import stylizeBoroughName from '../stylizeBoroughName'; 

class TwoBlocksPrompt extends React.Component {

	getHeaderText() {

		return [this.props.text, this.getTextAddition()].join(' '); 		

	}

	getTextAddition() {

		return !(this.props.gameOver) && this.props.choosingLocation && this.props.hoveredBorough ? stylizeBoroughName(this.props.hoveredBorough) + "?" :  ''; 

	}

	render() {

		return (

			<div className={ this.props.twoBlocksClass }>
				<h3>{ this.getHeaderText() }</h3>
			</div>

		); 

	}

}

TwoBlocksPrompt.propTypes = {
	
	gameOver 		: React.PropTypes.bool, 
	hoveredBorough 	: React.PropTypes.string, 
	twoBlocksClass 	: React.PropTypes.string.isRequired, 
	text 			: React.PropTypes.string

}; 

export default TwoBlocksPrompt; 
