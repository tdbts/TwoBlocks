import React from 'react'; 
import { TWO_BLOCKS_BUTTON_CLASS } from '../constants/constants'; 

class TwoBlocksReplayButton extends React.Component {

	getClassName() {

		return [

			this.props.twoBlocksClass, 
			TWO_BLOCKS_BUTTON_CLASS, 
			this.props.hidden ? "not-displayed" : ""

		].join(" ").trim();

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
