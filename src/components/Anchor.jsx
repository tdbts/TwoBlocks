import React from 'react';

const Anchor = function Anchor(props) {

	const { className, onRef } = props;

	return (

		<div 
			className={ className }
			ref={ onRef }
		></div> 

	);

};

Anchor.propTypes = {

	className: React.PropTypes.string,
	onRef: React.PropTypes.func

};

export default Anchor;
