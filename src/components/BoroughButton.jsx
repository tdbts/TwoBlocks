import React from 'react'; 
import stylizeBoroughName from './component-utils/stylizeBoroughName'; 
import { createPromiseTimeout } from '../utils/utils'; 
import { transitionTypes } from '../constants/constants'; 

class BoroughButton extends React.Component {

	constructor(props) {

		super(props); 

		this.state = {
			hasMounted: false, 
			transitionClass: null
		}; 

		/*----------  Save reference to original setState() method  ----------*/
		
		this._superSetState = this.setState.bind(this); 

		/*----------  Override setState() to be promisified  ----------*/
		
		this.setState = nextState => {

			return new Promise(resolve => {

				this._superSetState(nextState, resolve); 

			}); 

		}; 

	}

	componentWillMount() {

		const transitionClass = transitionTypes.SHOWING; 

		return this.delayShowingTransition()

			.then(() => this.setState({ transitionClass })); 

	}

	componentWillUnmount() {
		
		this.setState({
			transitionClass: null
		}); 

	}

	delayShowingTransition() {

		const { transitionTimeout } = this.props; 

		return createPromiseTimeout(transitionTimeout); 

	}

	render() {

		const { transitionClass } = this.state; 

		const { boroughButtonClassName, boroughName, isSelected, onButtonClick, orderClass } = this.props; 
	
		let classList = [ boroughButtonClassName, orderClass ]; 

		if (transitionClass) {

			classList.push(transitionClass); 
		
		}

		if (isSelected) {

			classList.push('selected'); 

		}

		classList = classList.join(' ').trim(); 

		return (
			<button className={ classList } onClick={ () => onButtonClick(boroughName) }>{ stylizeBoroughName(boroughName) }</button>
		); 

	}

}

/*----------  Define PropTypes  ----------*/

BoroughButton.propTypes = {
	boroughButtonClassName: React.PropTypes.string.isRequired, 
	boroughName: React.PropTypes.string.isRequired, 
	isSelected: React.PropTypes.bool.isRequired,
	onButtonClick: React.PropTypes.func.isRequired, 
	orderClass: React.PropTypes.string,
	transitionTimeout: React.PropTypes.number.isRequired
}; 

export default BoroughButton; 
