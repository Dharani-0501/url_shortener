import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gradient-wrapper">
          <div className="bg-glow-1"></div>
          <div className="bg-glow-2"></div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flexGrow: 1 }}>
            <AppRoutes />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
