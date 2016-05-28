function applyToOwnProp(action, obj, prop) {
	if (obj.hasOwnProperty(prop)) {
		return action(obj, prop); 
	}
}

export default applyToOwnProp;
