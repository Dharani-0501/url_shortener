import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Link2, LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar-glass">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Link2 size={20} color="white" />
          </div>
          <span className="text-gradient" style={{
            fontSize: '20px',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.5px'
          }}>
            Shortify
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {user ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '14px',
                color: 'var(--text-secondary)'
              }}>
                <User size={14} color="#a5b4fc" />
                <span>{user.username}</span>
              </div>

              {location.pathname !== '/dashboard' && (
                <Link to="/dashboard" className="btn-secondary btn-small" style={{ textDecoration: 'none' }}>
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </Link>
              )}

              <button onClick={handleLogout} className="btn-danger btn-small" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Link to="/login" className="btn-secondary btn-small" style={{ textDecoration: 'none' }}>
                  Login
                </Link>
              )}
              {location.pathname !== '/register' && (
                <Link to="/register" className="btn-primary btn-small" style={{ textDecoration: 'none' }}>
                  Get Started
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
