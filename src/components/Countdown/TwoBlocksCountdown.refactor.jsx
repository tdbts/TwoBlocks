import React from 'react';
import { connect } from 'react-redux';
import mapStateToProps from './mapStateToProps';

const TwoBlocksCountdown = function TwoBlocksCountdown(props) {

	const { isMobile, timeLeft } = props;

	const text = "Time left:";

	const spanClass = getSpanClass(timeLeft);

	const containerClassName = getContainerClassName(isMobile, timeLeft);

	return (
		
		<div className={ containerClassName }>{ text } 
			<span className={ spanClass }>{ timeLeft }</span>
		</div>
	
	);

};

/*----------  Helper Functions  ----------*/

const getSpanClass = function getSpanClass(timeLeft) {

	const timeClass = getTimeClass(timeLeft);

	return [ "time-left", timeClass ].join(" ").trim();

}; 

const getTimeClass = function getTimeClass(timeLeft) {

	let timeClass = '';

	if (timeLeft > 10) {

		timeClass = "green"; 
	
	} else if (timeLeft > 5) {
	
		timeClass = "yellow"; 
	
	} else {
	
		timeClass = "red"; 
	
	}	

	return timeClass;

}; 

const getVisibilityClass = function getVisibilityClass(isMobile, timeLeft) {

	// Refactor -- Why do this if a 'visible' state prop exists?
	// Why should any other component determine when the 
	// countdown is visible?
	// Why should the countdown itself be implemented elsewhere?
	return (isMobile && ('number' === typeof timeLeft) && (timeLeft > 0)) ? '' : 'hidden';

};

const getContainerClassName = function getContainerClassName(isMobile, timeLeft) {

	return [ "two-blocks-countdown", getVisibilityClass(isMobile, timeLeft) ].join(' ').trim();

}; 

/*----------  Define PropTypes  ----------*/

TwoBlocksCountdown.propTypes = {
	isMobile: React.PropTypes.bool.isRequired, 
	timeLeft: React.PropTypes.number
}; 

export default connect(mapStateToProps)(TwoBlocksCountdown);
