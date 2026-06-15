import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUrlAnalytics } from '../api/analyticsApi';
import { 
  ArrowLeft, Calendar, Shield, AlertTriangle, Eye, Clock
} from 'lucide-react';
import Loader from '../components/Loader';

const Analytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getUrlAnalytics(id);
      setData(res);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to retrieve analytics report');
    } finally {
      setLoading(false);
    }
  };

  const formatVisitTime = (isoString) => {
    if (!isoString) return 'Never';
    const d = new Date(isoString);
    return d.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: 'calc(100vh - 70px)', flexDirection: 'column' }}>
        <Loader message="Compiling analytics report..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-center animate-fade-in" style={{ minHeight: 'calc(100vh - 70px)', padding: '20px' }}>
        <div className="glass-card" style={{ maxWidth: '440px', textAlign: 'center', padding: '40px' }}>
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Analytics Error</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '15px' }}>{error || 'Link could not be loaded.'}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  const { url, totalClicks, lastVisited, recentVisits } = data;
  const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ padding: '8px 12px' }}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }} className="text-gradient">Link Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            Tracking for code: <strong style={{ color: 'var(--accent-cyan)' }}>/{url.shortCode}</strong>
          </p>
        </div>
      </div>

      <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '32px' }}>
        
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8',
            width: '48px', height: '48px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Eye size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Total Clicks
            </p>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '2px' }}>{totalClicks}</h2>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{
            background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc',
            width: '48px', height: '48px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Last Visited
            </p>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginTop: '6px', color: lastVisited ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {formatVisitTime(lastVisited)}
            </h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{
            background: isExpired ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', 
            color: isExpired ? '#fca5a5' : '#34d399',
            width: '48px', height: '48px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Shield size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Status
            </p>
            <div style={{ marginTop: '6px' }}>
              <span className={`badge ${isExpired ? 'badge-error' : 'badge-success'}`} style={{ fontSize: '11px' }}>
                {isExpired ? 'Expired' : 'Active'}
              </span>
            </div>
          </div>
        </div>

      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="var(--primary)" />
          <span>Recent Visit History</span>
        </h3>
        
        {recentVisits.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '14px' }}>
            No visit activity recorded yet.
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '80px', textAlign: 'center' }}>No.</th>
                  <th>Visit Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {recentVisits.map((visit, index) => (
                  <tr key={visit.id}>
                    <td style={{ textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {recentVisits.length - index}
                    </td>
                    <td style={{ fontSize: '14px', fontFamily: 'monospace' }}>
                      {new Date(visit.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Analytics;
