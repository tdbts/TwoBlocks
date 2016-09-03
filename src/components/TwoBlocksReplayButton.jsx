import React from 'react'; 

class TwoBlocksReplayButton extends React.Component {

	getClassName() {

		return [this.props.twoBlocksClass, this.props.hidden ? "not-displayed" : ""].join(" ").trim();

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
	
	hidden: React.PropTypes.bool.isRequired, 
	restart: React.PropTypes.func.isRequired, 
	twoBlocksClass: React.PropTypes.string.isRequired

}; 

export default TwoBlocksReplayButton; 
