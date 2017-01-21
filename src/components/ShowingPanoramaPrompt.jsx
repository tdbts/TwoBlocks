import React from 'react'; 
import { createPromiseTimeout } from '../utils/utils';


class ShowingPanoramaPrompt extends React.Component {

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

		return this.setState({

			animationClass: 'guessing-location-prompt-appear'

		})

		.then(() => createPromiseTimeout(1000))

		.then(callback);  
		
		// debugger;  // eslint-disable-line no-debugger 

	}	

	componentDidAppear() {

		return createPromiseTimeout(1000)

			.then(() => {

				const { animationClass } = this.state; 

				this.setState({

					animationClass: [ animationClass, 'guessing-location-prompt-appear-active' ].join(" ").trim()

				}); 

			}); 

		// debugger;  // eslint-disable-line no-debugger 
	}	

	componentWillEnter(callback) {

		return this.setState({

			animationClass: 'guessing-location-prompt-enter'

		})

		.then(() => createPromiseTimeout(1000))

		.then(callback); 
		
		// debugger;  // eslint-disable-line no-debugger 

	}

	componentDidEnter() {

		const { animationClass } = this.state; 

		return this.setState({
	
			animationClass: [ animationClass, 'guessing-location-prompt-enter-active' ].join(" ").trim()

		}); 

		// debugger;  // eslint-disable-line no-debugger 
	}

	componentWillLeave(callback) {

		return this.setState({

			animationClass: 'guessing-location-prompt-leave-active'

		})

		.then(() => createPromiseTimeout(300)) 

		.then(this.onComponentDidLeave)

		.then(callback); 
			
	}		

	render() {

		const { type } = this.props; 

		const { animationClass } = this.state; 

		const className = [ type, animationClass ].join(" ").trim(); 

		return (

			<span className={ className } key={ type }>Look closely...which borough is this Street View from?</span>
		
		);

	}	

}

export default ShowingPanoramaPrompt; 
