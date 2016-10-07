import applyToOwnProp from './applyToOwnProp';  

function applyToAllOwnProps(action, obj) {
	return Object.keys(obj).forEach(prop => applyToOwnProp(action, obj, prop)); 
}

export default applyToAllOwnProps; 
