import React from 'react'; 

class TwoBlocksReplayButton extends React.Component {

	getClassName() {

		return ["two-blocks-replay-button", this.props.hidden ? "hidden" : ""].join(" ").trim();

	}

	onReplayButtonClick() {

		this.props.restart(); 

	}

	render() {

		return (
			<button className={ this.getClassName() } onClick={ () => this.onReplayButtonClick() }>Play again?</button>
		); 

	}

}

TwoBlocksReplayButton.propTypes = {

	restart: React.PropTypes.func.isRequired

}; 

export default TwoBlocksReplayButton; 
