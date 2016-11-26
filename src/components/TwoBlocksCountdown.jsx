import React from 'react'; 

const TwoBlocksCountdown = function TwoBlocksCountdown(props) {

	const { interchangeHidden, mobile, timeLeft } = props; 

	const text = "Time left:"; 

	const visibilityClass = mobile && interchangeHidden && ('number' === typeof timeLeft) && (timeLeft > -1) ?  '' : 'hidden'; 

	const className = [ "two-blocks-countdown", visibilityClass ].join(' ').trim(); 

	return (
		<div className={ className }>{ `${text} ${timeLeft}`}</div>
	); 	

}; 

/*----------  Define PropTypes  ----------*/

TwoBlocksCountdown.propTypes = {
	interchangeHidden: React.PropTypes.bool, 
	mobile: React.PropTypes.bool.isRequired, 
	timeLeft: React.PropTypes.number
}; 

export default TwoBlocksCountdown; 
