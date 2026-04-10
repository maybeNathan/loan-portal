import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

const AppWithSuspense = () => {
  try {
    return (
      <AuthProvider>
        <App />
      </AuthProvider>
    );
  } catch (error) {
    console.error("App crashed:", error);
    return (
      <div style={{ 
        fontFamily: 'Arial', 
        padding: '2rem', 
        background: '#fce4ec', 
        border: '2px solid red' 
      }}>
        <h2>Error Loading App</h2>
        <p>{error.message}</p>
        <p>Check browser console (F12) for details</p>
      </div>
    );
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWithSuspense />
  </React.StrictMode>
)
