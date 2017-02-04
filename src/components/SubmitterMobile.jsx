import React from 'react'; 
import BoroughButtonsMobile from './BoroughButtonsMobile'; 
import FinalAnswerCheckMobile from './FinalAnswerCheckMobile'; 
import { gameStages } from '../constants/constants'; 

const SubmitterMobile = function SubmitterMobile(props) {

	const { borough, buttonClassName, confirmingAnswer, gameStage, onButtonClick, text, twoBlocksClass } = props; 

	const finalAnswerCheckVisibilityClass = borough ? '' : 'hidden';

	const markup = (borough && confirmingAnswer)

		? ( <FinalAnswerCheckMobile 
			borough={ borough }
			buttonClassName={ buttonClassName }
			onButtonClick={ onButtonClick }
			text={ text }
			wrapperClass={ [ twoBlocksClass, finalAnswerCheckVisibilityClass ].join(' ') }
		   	/> )  // eslint-disable-line no-mixed-spaces-and-tabs

		: (	<BoroughButtonsMobile  
			onButtonClick={ onButtonClick }
			selectedBorough={ borough }
			showButtons={ gameStage === gameStages.GUESSING_LOCATION }
			twoBlocksClass={ twoBlocksClass }
		    /> );  // eslint-disable-line no-mixed-spaces-and-tabs

	return markup; 
	
}; 

export default SubmitterMobile; 
