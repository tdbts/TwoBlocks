import React from 'react'; 
import stylizeBoroughName from '../stylizeBoroughName'; 

class TwoBlocksSubmitter extends React.Component {

	getBorough() {

		return this.props.selectedBorough ? stylizeBoroughName(this.props.selectedBorough) : ''; 

	}

	getClassName() {

		return ["two-blocks-submitter-button", this.props.selectedBorough ? "" : "hidden"].join(" ").trim();

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

			<div className={ this.props.twoBlocksClass }>
				<p className="two-blocks-submitter-text"> { text } <span className="two-blocks-submitter-borough-name">{ borough }</span></p>
				<button className={ this.getClassName() } onClick={ () => this.onSubmissionButtonClick() }>{ buttonLabel }</button>
			</div>

		); 

	}

}

TwoBlocksSubmitter.propTypes = {

	evaluateFinalAnswer 	: React.PropTypes.func.isRequired, 
	selectedBorough 		: React.PropTypes.string, 
	twoBlocksClass 			: React.PropTypes.string.isRequired

}; 

export default TwoBlocksSubmitter; 
