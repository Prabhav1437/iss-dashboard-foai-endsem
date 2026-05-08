import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import './index.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('iss-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.body.classList.toggle('light', !darkMode);
    localStorage.setItem('iss-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((d) => !d);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(10, 22, 40, 0.95)',
            color: '#e2e8f0',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            backdropFilter: 'blur(16px)',
            borderRadius: '12px',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#fff' },
          },
          duration: 3000,
        }}
      />
      <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </>
  );
};

export default App;
