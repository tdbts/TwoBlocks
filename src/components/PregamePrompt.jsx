import React from 'react'; 
import { createPromiseTimeout } from '../utils/utils';

class PregamePrompt extends React.Component {

	constructor(props) {

		super(props); 

		this.state = {

			animationClass: ''

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

	componentWillAppear(callback) {

		this.setState({

			animationClass: 'pregame-prompt-appear'

		})

		.then(() => {
			window.console.log("Calling componentWillAppear() callback."); 

			callback(); 
		});  
		
		// debugger;  // eslint-disable-line no-debugger 

	}

	componentDidAppear() {

		createPromiseTimeout(1000)

			.then(() => {

				const { animationClass } = this.state; 

				this.setState({

					animationClass: [ animationClass, 'pregame-prompt-appear-active' ].join(" ").trim()

				}); 

			}); 

		// debugger;  // eslint-disable-line no-debugger 
	}

	componentWillEnter(callback) {

		this.setState({

			animationClass: 'pregame-prompt-enter'

		})

		.then(() => {
			window.console.log("Calling componentWillEnter() callback."); 

			callback(); 
		}); 
		
		// debugger;  // eslint-disable-line no-debugger 

	}

	componentDidEnter() {

		const { animationClass } = this.state; 

		this.setState({
	
			animationClass: [ animationClass, 'pregame-prompt-enter-active' ].join(" ").trim()

		}); 

		// debugger;  // eslint-disable-line no-debugger 
	}

	componentWillLeave(callback) {

		this.setState({

			animationClass: 'pregame-prompt-leave-active'

		})

		.then(() => createPromiseTimeout(300)) 

		.then(() => {
			window.console.log("Calling componentWillLeave() callback."); 
			callback(); 
		}); 
			
		// debugger;  // eslint-disable-line no-debugger 
	}	

	render() {

		const { type } = this.props; 

		const { animationClass } = this.state; 

		const className = [ type, animationClass ].join(" ").trim(); 

		return (

			<span className={ className } key={ type } >Loading new TwoBlocks game...</span>
		
		);

	}

}

/*----------  Define Proptypes  ----------*/

PregamePrompt.propTypes = {

	type: React.PropTypes.string.isRequired

}; 

export default PregamePrompt; 
