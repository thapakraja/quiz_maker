
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const renderApp = () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error("Could not find root element to mount to");
    }

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
};

// Render the app immediately
renderApp();

// Load libraries in background (non-blocking)
setTimeout(() => {
    try {
        if ((window as any).pdfjsLib) {
            const pdfjsLib = (window as any).pdfjsLib;
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
            console.log('PDF libraries loaded successfully');
        }
    } catch (error) {
        console.warn('PDF library setup failed, but app continues:', error);
    }
}, 1000);
