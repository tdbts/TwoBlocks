/* global document */

import 'babel-polyfill'; 
import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import TwoBlocks from '../src/components/TwoBlocks/TwoBlocks.refactor';
import twoBlocks from '../src/reducers/twoBlocks';

const reducers = [ twoBlocks, {} ];

if ('development' === process.env.NODE_ENV) {

	reducers.push(composeWithDevTools());

}

const store = createStore(...reducers);

render(
	
	<Provider store={store}>
		<TwoBlocks /> 
	</Provider>, 

	document.querySelector('.app-container'));
