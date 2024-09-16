import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

const originalConsoleError = console.error;
console.error = (message, ...args) => {
    if (typeof message === 'string' && message.includes('defaultProps will be removed')) {
        return;
    }
    originalConsoleError.apply(console, [message, ...args]);
};
