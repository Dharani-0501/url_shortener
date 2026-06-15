import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: 'calc(100vh - 70px)', padding: '20px' }}>
      <div className="glass-card" style={{ maxWidth: '440px', textAlign: 'center', padding: '40px' }}>
        <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '20px', display: 'inline-block' }} />
        <h2 style={{ fontSize: '28px', marginBottom: '10px' }} className="text-gradient">404 - Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '15px', lineHeight: 1.5 }}>
          The page you are looking for does not exist, has been moved, or you are not authorized to view it.
        </p>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} />
          <span>Go to Home</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
