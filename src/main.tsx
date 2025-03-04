import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setupStorageFixing } from './utils/cacheFix';
import './index.css';

// Setup storage fixing - run before app initialization
setupStorageFixing();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);