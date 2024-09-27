import React from 'react';
import ReactDOM from 'react-dom'; // React 17 uses 'react-dom'
import App from './App';

// Use ReactDOM.render for React 17
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
