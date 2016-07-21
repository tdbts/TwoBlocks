import React from 'react'; 
import stylizeBoroughName from '../stylizeBoroughName'; 

class TwoBlocksSubmitter extends React.Component {

	onSubmissionButtonClick() {

		this.props.evaluateFinalAnswer(); 

	}

	styleText(text) {

		return text; 

	}

	render() {

		const text = this.styleText(stylizeBoroughName(this.props.selectedBorough) || ''); 
		const buttonLabel = "Final answer?"; 

		return (

			<div id="twoBlocks-submitter">
				<p id="twoBlocks-submitter-text"> { text } </p>
				<button id="twoBlocks-submitter-button" onClick={ () => this.onSubmissionButtonClick() }>{ buttonLabel }</button>
			</div>

		); 

	}

}

export default TwoBlocksSubmitter; 
