import React from 'react';

const Platform = function Platform(props) {

	const { className, onRef } = props;

	return (

		<div 
			className={ className }
			ref={ onRef }
		></div> 

	);

};

Platform.propTypes = {

	className: React.PropTypes.string,
	onRef: React.PropTypes.func

};

export default Platform;
