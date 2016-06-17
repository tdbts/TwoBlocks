import 'babel-polyfill'; 
import React from 'react'; 
import { render } from 'react-dom'; 
import TwoBlocks from '../src/components/TwoBlocks.jsx'; 

render(<TwoBlocks />, document.getElementById('app-container')); 
