import React from 'react'; 

class TwoBlocksSubmitter extends React.Component {

	componentDidUpdate() {

		window.console.log("this.props.selectedBorough:", this.props.selectedBorough); 
		
	}

	onSubmissionButtonClick() {

		window.console.log("Submission button clicked!"); 

	}

	styleText(text) {

		return text; 

	}

	render() {

		const text = this.styleText(this.props.selectedBorough || ''); 
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
