import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex-center" style={{ padding: '60px', flexDirection: 'column', gap: '12px' }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid rgba(255, 255, 255, 0.1)',
        borderLeftColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{message}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
