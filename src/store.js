import { createStore } from 'redux'; 
import twoBlocks from './reducers/twoBlocks'; 

const store = createStore(twoBlocks); 

export default store; 
