import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated for React 18

import App from './App';

// Find the root element in your HTML where the app will be mounted
const rootElement = document.getElementById('root');

// Create a root and render the app within the Provider (Redux)
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Use createRoot for React 18
  root.render(

      <App />
   
  );
} else {
  console.error('Root element not found.');
}
