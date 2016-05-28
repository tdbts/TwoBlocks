import applyToAllOwnProps from './applyToAllOwnProps'; 

const addPropTo = (receiver) => (obj, prop) => {
	receiver[prop] = obj[prop]; 
}; 

const merge = (first, second) => {
	applyToAllOwnProps(addPropTo(first), second); 
}; 

export default merge; 
