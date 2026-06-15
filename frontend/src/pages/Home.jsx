import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Link2, BarChart3, QrCode, Shield, CheckCircle, Zap } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          lineHeight: 1.1,
          marginBottom: '20px',
          fontWeight: 800
        }}>
          Shorten Links. <br />
          <span className="text-gradient-accent">Track Performance.</span>
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--text-secondary)',
          maxWidth: '650px',
          margin: '0 auto 40px auto',
          lineHeight: 1.6
        }}>
          Create clean, custom shortened URLs in seconds. Track detailed visit demographics, browser distributions, and daily click trends with our advanced analytics dashboard.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          {user ? (
            <Link to="/dashboard" className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px', textDecoration: 'none' }}>
              <span>Go to Dashboard</span>
              <Zap size={18} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px', textDecoration: 'none' }}>
                <span>Create Free Account</span>
              </Link>
              <Link to="/login" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '16px', textDecoration: 'none' }}>
                <span>Sign In</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px' }} className="text-gradient">
          Everything you need in one platform
        </h2>
        <div className="grid-container">
          <div className="glass-card">
            <div style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Link2 size={24} />
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Unique Short Links</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Instantly convert complex URLs into short, memorable links. Supports custom aliases and secure server-side redirects.
            </p>
          </div>

          <div className="glass-card">
            <div style={{
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#c084fc',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <BarChart3 size={24} />
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Real-time Analytics</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Analyze click metrics, referrers, device models, browsers, operating systems, and location demographics instantly.
            </p>
          </div>

          <div className="glass-card">
            <div style={{
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#22d3ee',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <QrCode size={24} />
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>QR Code Generation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Every short URL automatically generates a high-quality QR Code. Download and display it on print and digital media easily.
            </p>
          </div>

          <div className="glass-card">
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Link Expiration</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Set custom expiration dates and times on your links. Automatically disable access to redirect targets after a deadline.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{
        textAlign: 'center',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '8px', color: '#34d399', alignItems: 'center' }}>
          <CheckCircle size={20} />
          <span style={{ fontWeight: 600 }}>100% Free and Secure</span>
        </div>
        <h3 style={{ fontSize: '24px' }}>Ready to clean up your link sharing?</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', fontSize: '14px', lineHeight: 1.5 }}>
          Create an account to manage all your shortened links from a single responsive dashboard and unlock detailed statistics.
        </p>
        <Link to={user ? "/dashboard" : "/register"} className="btn-primary" style={{ textDecoration: 'none', marginTop: '10px' }}>
          {user ? 'Go to Dashboard' : 'Get Started Now'}
        </Link>
      </div>
    </div>
  );
};

export default Home;
