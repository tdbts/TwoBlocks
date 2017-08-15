import React from 'react'; 
import { connect } from 'react-redux';
import getButtonClassList from '../getButtonClassList';
import getPromptText from '../getPromptText';
import getSubmitterClassList from '../getSubmitterClassList';
import mapStateToProps from './mapStateToProps';
import mapDispatchToProps from './mapDispatchToProps';

const SubmitterDesktop = function SubmitterDesktop(props) {

	const { 

		onKeyDown,
		selectedBorough, 
		submitBorough

	} = props; 

	const buttonLabel = "Final answer?";

	const buttonClassList = getButtonClassList(selectedBorough);

	const promptText = getPromptText(selectedBorough);

	const spanText = getSpanText(selectedBorough);

	return (
		
		<div className={ getContainerClass(selectedBorough) }>
			
			<p className="two-blocks-submitter-text"> { promptText } <span className="two-blocks-submitter-borough-name">{ spanText }</span></p>

			<button className={ buttonClassList } onClick={ submitBorough } onKeyDown={ onKeyDown }>{ buttonLabel }</button>
		
		</div>

	);
	
};

/*----------  Helper Functions  ----------*/

const getContainerClass = function getContainerClass(selectedBorough) {

	return [

		getSubmitterClassList(), 
		getVisibilityClass(selectedBorough)

	].join(' ');

};

const getSpanText = function getSpanText(selectedBorough) {

	return (selectedBorough ? selectedBorough.getName() : '');

}; 


const getVisibilityClass = function getVisibilityClass(selectedBorough) {

	return (selectedBorough ? '' : 'hidden');

}; 

export default connect(mapStateToProps, mapDispatchToProps)(SubmitterDesktop); 
