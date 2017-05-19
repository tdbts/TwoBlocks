import React from 'react'; 

const TwoBlocksCountdown = function TwoBlocksCountdown(props) {

	const { mobile, timeLeft } = props; 

	const text = "Time left:"; 

	let timeClass = null; 

	if (timeLeft > 10) {

		timeClass = "green"; 
	
	} else if (timeLeft > 5) {
	
		timeClass = "yellow"; 
	
	} else {
	
		timeClass = "red"; 
	
	}

	const visibilityClass = mobile && ('number' === typeof timeLeft) && (timeLeft > 0) ?  '' : 'hidden'; 

	const className = [ "two-blocks-countdown", visibilityClass ].join(' ').trim(); 

	return (
		<div className={ className }>{ text } <span className={ timeClass }>{ timeLeft }</span></div>
	); 	

}; 

/*----------  Define PropTypes  ----------*/

TwoBlocksCountdown.propTypes = {
	interchangeHidden: React.PropTypes.bool, 
	mobile: React.PropTypes.bool.isRequired, 
	timeLeft: React.PropTypes.number
}; 

export default TwoBlocksCountdown; 
