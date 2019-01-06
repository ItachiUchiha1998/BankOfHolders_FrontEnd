import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { CookiesProvider } from 'react-cookie';
// disable ServiceWorker
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <CookiesProvider><App /></CookiesProvider>,
    document.getElementById('root'));
// disable ServiceWorker
// registerServiceWorker();