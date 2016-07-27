import React from 'react'; 
import stylizeBoroughName from '../stylizeBoroughName'; 

class TwoBlocksPrompt extends React.Component {

	getTextAddition() {

		return this.props.hoveredBorough ? stylizeBoroughName(this.props.hoveredBorough) + "?" :  ''; 

	}

	render() {

		return (

			<div id={ this.props.promptId }>
				<h3>{ [this.props.text, this.getTextAddition()].join(' ') }</h3>
			</div>

		); 

	}

}

TwoBlocksPrompt.propTypes = {
	
	promptId: React.PropTypes.string.isRequired, 
	
	text: React.PropTypes.string

}; 

export default TwoBlocksPrompt; 
