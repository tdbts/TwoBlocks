import React from 'react';
import { connect } from 'react-redux';
import BoroughButton from './BoroughButton/BoroughButton.refactor'; 
import Borough from '../../../../game-components/Borough';
import mapStateToProps from './mapStateToProps';
import mapDispatchToProps from './mapDispatchToProps';
import { transitionTypes } from '../../../../constants/constants';
import { createPromiseTimeout } from '../../../../utils/utils'; 

class BoroughButtonsMobile extends React.Component {

	constructor(props) {
		
		super(props);

		this.ORDER_CLASS_APPENDAGE = '-borough-selection-button';
		this.TRANSITION_LENGTH = 1500;
		this.TRANSITION_TIMEOUT = 250;
		
		this.state = {
			transitionClass: null
		};

		this._boroughs = {
			BRONX: new Borough('Bronx'),
			MANHATTAN: new Borough('Manhattan'),
			QUEENS: new Borough('Queens'),
			BROOKLYN: new Borough('Brooklyn'),
			STATEN_ISLAND: new Borough('Staten Island')
		};

		this._orders = [
			'first',
			'second',
			'third',
			'fourth',
			'fifth'
		];


		this._promisifySetState();

	}

	componentDidMount() {

		this.props.onMount();

		createPromiseTimeout(this.TRANSITION_TIMEOUT)

			.then(() => this.setState({

				transitionClass: transitionTypes.SHOWING

			}));

	}

	_checkIfSelected(borough) {

		const { selectedBorough } = this.props;

		return selectedBorough && selectedBorough.getID() === borough.getID();

	}

	_getContainerClassList() {
	 
		return [ 
		
			'two-blocks-interchange-component',
			'two-blocks-submitter',
			this.props.selectedBorough ? 'borough-selected' : '' 
		
		].join(" ").trim();

	}

	_generateButtonProps(name, i) {

		const { transitionClass } = this.state;

		const borough = this._boroughs[name];

		const order = this._orders[i];

		return {
			transitionClass,
			key: order,
			label: borough.getName(),
			isSelected: this._checkIfSelected(borough),
			onClick: () => this._onClick(borough),
			orderClass: order + this.ORDER_CLASS_APPENDAGE
		};

	}

	_onClick(borough) {

		const { onReadyForUnmount, setSelectedBorough } = this.props;

		setSelectedBorough(borough);

		createPromiseTimeout(this.TRANSITION_LENGTH)

			.then(() => onReadyForUnmount());
	
	}

	_promisifySetState() {

		/*----------  Save reference to original setState() method  ----------*/
		
		this._superSetState = this.setState.bind(this); 

		/*----------  Override setState() to be promisified  ----------*/
		
		this.setState = nextState => {

			return new Promise(resolve => {

				this._superSetState(nextState, resolve); 

			}); 

		};

	}

	_renderBoroughButtons() {


		return Object.keys(this._boroughs)

			.map((name, i) => this._generateButtonProps(name, i))

			.map(props => <BoroughButton { ...props } />);

	}

	render() {

		const classList = this._getContainerClassList();

		return (

			<div className={ classList }>
				{ this._renderBoroughButtons() }
			</div>

		); 	

	}

}

/*----------  Define Proptypes  ----------*/

BoroughButtonsMobile.propTypes = {

	selectedBorough: React.PropTypes.string

}; 

export default connect(mapStateToProps, mapDispatchToProps)(BoroughButtonsMobile); 
