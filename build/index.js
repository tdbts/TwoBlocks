/* global document, window */

import 'babel-polyfill'; 
import React from 'react'; 
import TwoBlocks from '../src/components/TwoBlocks';
import { render } from 'react-dom';

render(<TwoBlocks />, document.getElementById('app-container'));
