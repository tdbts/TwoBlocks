import actions from '../actions/actions';

const DEFAULT_STATE = null; 

const mapLatLng = function mapLatLng(state = DEFAULT_STATE, action) {

	let nextState = state; 

	const { type, latLng } = action; 

	if (actions.SET_MAP_LAT_LNG === type) {

		if (nextState === latLng) return nextState;  // No change  

		nextState = latLng;  // Set new game latLng 
	
	} else if (actions.RESTART_GAME === type) {

		nextState = DEFAULT_STATE; 
		
	}

	return nextState; 

}; 

export default mapLatLng; 
