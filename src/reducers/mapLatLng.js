import actions from '../actions/actions';

const mapLatLng = function mapLatLng(state = null, action) {

	let nextState = state; 

	const { type, latLng } = action; 

	if (actions.SET_MAP_LAT_LNG !== type) return nextState;  // Wrong action

	if (nextState === latLng) return nextState;  // No change  

	nextState = latLng;  // Set new game latLng 

	return nextState; 

}; 

export default mapLatLng; 
