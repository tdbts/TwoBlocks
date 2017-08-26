/* global document */

import 'babel-polyfill'; 
import React from 'react';
import { logger } from 'redux-logger';
import { render } from 'react-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import TwoBlocks from '../src/components/TwoBlocks/TwoBlocks';
import twoBlocks from '../src/reducers/twoBlocks';

const reducers = [ twoBlocks, {} ];

if ('development' === process.env.NODE_ENV) {

	reducers.push(compose(applyMiddleware(logger), composeWithDevTools()));

}

const store = createStore(...reducers);

render(
	
	<Provider store={store}>
		<TwoBlocks /> 
	</Provider>, 

	document.querySelector('.app-container'));
