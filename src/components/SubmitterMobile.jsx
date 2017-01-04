import React from 'react'; 
import BoroughButtonsMobile from './BoroughButtonsMobile'; 
import FinalAnswerCheckMobile from './FinalAnswerCheckMobile'; 

const SubmitterMobile = function SubmitterMobile(props) {

	const { borough, buttonClassName, onButtonClick, text,  twoBlocksClass } = props; 

	const finalAnswerCheckVisibilityClass = borough ? '' : 'hidden';

	const markup = borough 

		? ( <FinalAnswerCheckMobile 
			borough={ borough }
			buttonClassName={ buttonClassName }
			onButtonClick={ onButtonClick }
			text={ text }
			wrapperClass={ [ twoBlocksClass, finalAnswerCheckVisibilityClass ].join(' ') }
		   	/> )  // eslint-disable-line no-mixed-spaces-and-tabs

		: (	<BoroughButtonsMobile  
			onButtonClick={ onButtonClick }
			twoBlocksClass={ twoBlocksClass }
		    /> );  // eslint-disable-line no-mixed-spaces-and-tabs

	return markup; 
	
}; 

export default SubmitterMobile; 
