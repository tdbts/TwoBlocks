import React from 'react'; 
import stylizeBoroughName from '../stylizeBoroughName'; 

class TwoBlocksSubmitter extends React.Component {

	getBorough() {

		return this.props.selectedBorough ? stylizeBoroughName(this.props.selectedBorough) : ''; 

	}

	getText() {

		return this.props.selectedBorough ? "You chose: " : ""; 

	}

	onSubmissionButtonClick() {

		this.props.evaluateFinalAnswer(); 

	}

	render() {

		const text = this.getText(); 
		const borough = this.getBorough(); 
		const buttonLabel = "Final answer?"; 

		return (

			<div className="two-blocks-submitter">
				<p className="two-blocks-submitter-text"> { text } <span className="two-blocks-submitter-borough-name">{ borough }</span></p>
				<button className="two-blocks-submitter-button" className={ this.props.selectedBorough ? '' : 'hidden' } onClick={ () => this.onSubmissionButtonClick() }>{ buttonLabel }</button>
			</div>

		); 

	}

}

TwoBlocksSubmitter.propTypes = {

	evaluateFinalAnswer 	: React.PropTypes.func.isRequired, 
	selectedBorough 		: React.PropTypes.string

}; 

export default TwoBlocksSubmitter; 
