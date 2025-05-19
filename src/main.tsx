import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ApolloWrapper from './Apollo';

// Find the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create root once and render your app
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ApolloWrapper >
      <App />
    </ApolloWrapper>
  </React.StrictMode>
);