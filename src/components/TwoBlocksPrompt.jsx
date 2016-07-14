import React from 'react'; 

class TwoBlocksPrompt extends React.Component {

	render() {

		return (

			<div id={ this.props.promptId }>
				<h3>{ this.props.text }</h3>
			</div>

		); 

	}

}

TwoBlocksPrompt.propTypes = {
	
	promptId: React.PropTypes.string.isRequired, 
	
	text: React.PropTypes.string

}; 

export default TwoBlocksPrompt; 
