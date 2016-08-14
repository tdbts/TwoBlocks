import React from 'react'; 
import stylizeBoroughName from '../stylizeBoroughName'; 

class TwoBlocksPrompt extends React.Component {

	getTextAddition() {

		return this.props.hoveredBorough ? stylizeBoroughName(this.props.hoveredBorough) + "?" :  ''; 

	}

	render() {

		return (

			<div className={ this.props.promptClassName }>
				<h3>{ [this.props.text, this.getTextAddition()].join(' ') }</h3>
			</div>

		); 

	}

}

TwoBlocksPrompt.propTypes = {

	hoveredBorough 	: React.PropTypes.string, 
	promptClassName : React.PropTypes.string.isRequired, 
	text 			: React.PropTypes.string

}; 

export default TwoBlocksPrompt; 
