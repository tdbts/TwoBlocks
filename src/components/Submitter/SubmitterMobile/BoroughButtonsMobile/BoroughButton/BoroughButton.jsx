import React from 'react';

class BoroughButton extends React.Component {

	_getClassList(isSelected) {

		const { transitionClass } = this.props;

		const { orderClass } = this.props;

		const classList = [

			"two-blocks-button",
			"two-blocks-mobile-button",
			"borough-selection-button",
			orderClass

		];

		if (transitionClass) {
			
			classList.push(transitionClass);

		}

		if (isSelected) {

			classList.push('selected');

		}

		return classList.join(" ").trim();

	}

	render() {

		const { isSelected, label, onClick } = this.props; 

		const classList = this._getClassList(isSelected);

		return (
			<button className={ classList } onClick={ onClick }>{ label }</button>
		); 

	}

}

/*----------  Define PropTypes  ----------*/

BoroughButton.propTypes = {   
	orderClass: React.PropTypes.string
}; 

/*----------  Export  ----------*/

export default BoroughButton; 
