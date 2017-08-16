import React from 'react'; 
import { connect } from 'react-redux';
import BoroughButtonsMobile from './BoroughButtonsMobile/BoroughButtonsMobile'; 
import FinalAnswerCheckMobile from './FinalAnswerCheckMobile/FinalAnswerCheckMobile'; 
import mapDispatchToProps from './mapDispatchToProps';
import mapStateToProps from './mapStateToProps';

class SubmitterMobile extends React.Component {

	constructor(props) {
		
		super(props);
		
		this.state = {

			canUnmountButtons: false
		
		};

	}

	_onMount() {

		this.setState({ canUnmountButtons: false });

	}

	_onReadyForUnmount() {

		this.setState({ canUnmountButtons: true });

	}

	render() {

		const { canUnmountButtons } = this.state;

		const { confirmingAnswer } = this.props;

		const visibleComponent = (confirmingAnswer && canUnmountButtons)

			? <FinalAnswerCheckMobile />

			: <BoroughButtonsMobile
				onMount={ () => this._onMount() } 
				onReadyForUnmount={ () => this._onReadyForUnmount() } />;

		return visibleComponent; 

	}

}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitterMobile); 
